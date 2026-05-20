import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { CreateWarehouseDto } from './dto/create-warehouse.dto'
import type { StockQueryDto, TransferQueryDto, WarehouseQueryDto } from './dto/warehouse-query.dto'

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) {}
  async listWarehouses(shopId: string, query: WarehouseQueryDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT, search, isActive } = query

    const where: Prisma.WarehouseWhereInput = {
      shopId,
      ...withDefined({ isActive: isActive }),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const { items, total } = await offsetPaginate(this.prisma.warehouse, {
      page,
      limit,
      where,
      include: { _count: { select: { stocks: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async createWarehouse(shopId: string, dto: CreateWarehouseDto) {
    if (dto.isDefault) {
      await this.prisma.warehouse.updateMany({
        where: { shopId, isDefault: true },
        data: { isDefault: false },
      })
    }

    return this.prisma.warehouse.create({
      data: {
        shopId,
        name: dto.name,
        code: dto.code.toUpperCase(),
        ...withDefined({ address: dto.address }),
        isDefault: dto.isDefault ?? false,
      },
    })
  }

  async getWarehouse(shopId: string, warehouseId: string) {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: { id: warehouseId, shopId },
      include: { _count: { select: { stocks: true } } },
    })

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found')
    }

    return warehouse
  }

  async getWarehouseStock(shopId: string, warehouseId: string, query: StockQueryDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT, lowStock } = query

    const warehouse = await this.prisma.warehouse.findFirst({
      where: { id: warehouseId, shopId },
    })

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found')
    }

    const stockWhere: Prisma.WarehouseStockWhereInput = {
      warehouseId,
      ...(lowStock ? { stock: { lte: 10 } } : {}),
    }

    const { items, total } = await offsetPaginate(this.prisma.warehouseStock, {
      page,
      limit,
      where: stockWhere,
      orderBy: { updatedAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async updateStock(
    shopId: string,
    warehouseId: string,
    variantId: string,
    stock: number,
    safetyStock?: number,
  ) {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: { id: warehouseId, shopId },
    })

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found')
    }

    return this.prisma.warehouseStock.upsert({
      where: { warehouseId_variantId: { warehouseId, variantId } },
      create: { warehouseId, variantId, stock, safetyStock: safetyStock ?? 0 },
      update: safetyStock !== undefined ? { stock, safetyStock } : { stock },
    })
  }

  async createTransfer(
    shopId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    items: { variantId: string; quantity: number }[],
    note?: string,
  ) {
    if (fromWarehouseId === toWarehouseId) {
      throw new BadRequestException('Cannot transfer to the same warehouse')
    }

    const [from, to] = await Promise.all([
      this.prisma.warehouse.findFirst({ where: { id: fromWarehouseId, shopId } }),
      this.prisma.warehouse.findFirst({ where: { id: toWarehouseId, shopId } }),
    ])

    if (!from || !to) {
      throw new NotFoundException('Warehouse not found')
    }

    const data: Prisma.InventoryTransferUncheckedCreateInput = {
      shopId,
      fromWarehouseId,
      toWarehouseId,
      items: {
        create: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    }

    if (note !== undefined) {
      data.note = note
    }

    return this.prisma.inventoryTransfer.create({
      data,
      include: { items: true },
    })
  }

  async listTransfers(shopId: string, query: TransferQueryDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT, status } = query

    const where: Prisma.InventoryTransferWhereInput = { shopId }
    if (status) where.status = status as NonNullable<Prisma.InventoryTransferWhereInput['status']>

    const { items, total } = await offsetPaginate(this.prisma.inventoryTransfer, {
      page,
      limit,
      where,
      include: {
        fromWarehouse: { select: { id: true, name: true, code: true } },
        toWarehouse: { select: { id: true, name: true, code: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async completeTransfer(shopId: string, transferId: string) {
    const transfer = await this.prisma.inventoryTransfer.findFirst({
      where: { id: transferId, shopId },
      include: { items: true },
    })

    if (!transfer) {
      throw new NotFoundException('Transfer not found')
    }

    if (transfer.status !== 'PENDING' && transfer.status !== 'IN_TRANSIT') {
      throw new BadRequestException('Transfer cannot be completed in current status')
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const item of transfer.items) {
        await tx.warehouseStock.update({
          where: {
            warehouseId_variantId: {
              warehouseId: transfer.fromWarehouseId,
              variantId: item.variantId,
            },
          },
          data: { stock: { decrement: item.quantity } },
        })

        await tx.warehouseStock.upsert({
          where: {
            warehouseId_variantId: {
              warehouseId: transfer.toWarehouseId,
              variantId: item.variantId,
            },
          },
          create: {
            warehouseId: transfer.toWarehouseId,
            variantId: item.variantId,
            stock: item.quantity,
          },
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
    const warehouses = await this.prisma.warehouse.findMany({
      where: { shopId, isActive: true },
      select: { id: true },
    })

    const warehouseIds = warehouses.map((w: { id: string }) => w.id)

    const lowStockItems = await this.prisma.$queryRaw<
      Array<{ warehouse_id: string; variant_id: string; stock: number; safety_stock: number }>
    >`
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
