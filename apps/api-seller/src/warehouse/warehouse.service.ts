import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { WarehouseQueryDto, StockQueryDto, TransferQueryDto } from './dto/warehouse-query.dto'
import { CreateWarehouseDto } from './dto/create-warehouse.dto'
import { buildPaginationMeta } from '../common/dto/pagination.dto'

@Injectable()
export class WarehouseService {
  async listWarehouses(shopId: string, query: WarehouseQueryDto) {
    const { page = 1, limit = 20, search, isActive } = query

    const where: Prisma.WarehouseWhereInput = {
      shopId,
      ...(isActive !== undefined ? { isActive } : {}),
      ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }] } : {}),
    }

    const [warehouses, total] = await Promise.all([
      prisma.warehouse.findMany({
        where,
        include: { _count: { select: { stocks: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.warehouse.count({ where }),
    ])

    return { data: warehouses, meta: buildPaginationMeta(page, limit, total) }
  }

  async createWarehouse(shopId: string, dto: CreateWarehouseDto) {
    if (dto.isDefault) {
      await prisma.warehouse.updateMany({
        where: { shopId, isDefault: true },
        data: { isDefault: false },
      })
    }

    return prisma.warehouse.create({
      data: {
        shopId,
        name: dto.name,
        code: dto.code.toUpperCase(),
        address: dto.address,
        isDefault: dto.isDefault ?? false,
      },
    })
  }

  async getWarehouse(shopId: string, warehouseId: string) {
    const warehouse = await prisma.warehouse.findFirst({
      where: { id: warehouseId, shopId },
      include: { _count: { select: { stocks: true } } },
    })

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found')
    }

    return warehouse
  }

  async getWarehouseStock(shopId: string, warehouseId: string, query: StockQueryDto) {
    const { page = 1, limit = 20, lowStock } = query

    const warehouse = await prisma.warehouse.findFirst({
      where: { id: warehouseId, shopId },
    })

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found')
    }

    const stockWhere: Prisma.WarehouseStockWhereInput = {
      warehouseId,
      ...(lowStock ? { stock: { lte: 10 } } : {}),
    }

    const [stocks, total] = await Promise.all([
      prisma.warehouseStock.findMany({
        where: stockWhere,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.warehouseStock.count({ where: { warehouseId } }),
    ])

    return { data: stocks, meta: buildPaginationMeta(page, limit, total) }
  }

  async updateStock(shopId: string, warehouseId: string, variantId: string, stock: number, safetyStock?: number) {
    const warehouse = await prisma.warehouse.findFirst({
      where: { id: warehouseId, shopId },
    })

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found')
    }

    return prisma.warehouseStock.upsert({
      where: { warehouseId_variantId: { warehouseId, variantId } },
      create: { warehouseId, variantId, stock, safetyStock: safetyStock ?? 0 },
      update: { stock, ...(safetyStock !== undefined ? { safetyStock } : {}) },
    })
  }

  async createTransfer(shopId: string, fromWarehouseId: string, toWarehouseId: string, items: { variantId: string; quantity: number }[], note?: string) {
    if (fromWarehouseId === toWarehouseId) {
      throw new BadRequestException('Cannot transfer to the same warehouse')
    }

    const [from, to] = await Promise.all([
      prisma.warehouse.findFirst({ where: { id: fromWarehouseId, shopId } }),
      prisma.warehouse.findFirst({ where: { id: toWarehouseId, shopId } }),
    ])

    if (!from || !to) {
      throw new NotFoundException('Warehouse not found')
    }

    return prisma.inventoryTransfer.create({
      data: {
        shopId,
        fromWarehouseId,
        toWarehouseId,
        note,
        items: {
          create: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    })
  }

  async listTransfers(shopId: string, query: TransferQueryDto) {
    const { page = 1, limit = 20, status } = query

    const where: Prisma.InventoryTransferWhereInput = {
      shopId,
      ...(status ? { status: status as Prisma.InventoryTransferWhereInput['status'] } : {}),
    }

    const [transfers, total] = await Promise.all([
      prisma.inventoryTransfer.findMany({
        where,
        include: {
          fromWarehouse: { select: { id: true, name: true, code: true } },
          toWarehouse: { select: { id: true, name: true, code: true } },
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inventoryTransfer.count({ where }),
    ])

    return { data: transfers, meta: buildPaginationMeta(page, limit, total) }
  }

  async completeTransfer(shopId: string, transferId: string) {
    const transfer = await prisma.inventoryTransfer.findFirst({
      where: { id: transferId, shopId },
      include: { items: true },
    })

    if (!transfer) {
      throw new NotFoundException('Transfer not found')
    }

    if (transfer.status !== 'PENDING' && transfer.status !== 'IN_TRANSIT') {
      throw new BadRequestException('Transfer cannot be completed in current status')
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const item of transfer.items) {
        await tx.warehouseStock.update({
          where: { warehouseId_variantId: { warehouseId: transfer.fromWarehouseId, variantId: item.variantId } },
          data: { stock: { decrement: item.quantity } },
        })

        await tx.warehouseStock.upsert({
          where: { warehouseId_variantId: { warehouseId: transfer.toWarehouseId, variantId: item.variantId } },
          create: { warehouseId: transfer.toWarehouseId, variantId: item.variantId, stock: item.quantity },
          update: { stock: { increment: item.quantity } },
        })
      }

      return tx.inventoryTransfer.update({
        where: { id: transferId },
        data: { status: 'COMPLETED' },
      })
    })
  }

  async getLowStockAlerts(shopId: string) {
    const warehouses = await prisma.warehouse.findMany({
      where: { shopId, isActive: true },
      select: { id: true },
    })

    const warehouseIds = warehouses.map((w: { id: string }) => w.id)

    const lowStockItems = await prisma.$queryRaw<Array<{ warehouse_id: string; variant_id: string; stock: number; safety_stock: number }>>`
      SELECT warehouse_id, variant_id, stock, safety_stock
      FROM warehouse_stocks
      WHERE warehouse_id = ANY(${warehouseIds}::uuid[])
        AND stock <= safety_stock
        AND safety_stock > 0
      ORDER BY (stock::float / NULLIF(safety_stock, 0)) ASC
      LIMIT 50
    `

    return lowStockItems
  }
}
