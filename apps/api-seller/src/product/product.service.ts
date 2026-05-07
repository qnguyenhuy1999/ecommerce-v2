import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductQueryDto } from './dto/product-query.dto'
import { buildPaginationMeta } from '../common/dto/pagination.dto'

@Injectable()
export class ProductService {
  async list(shopId: string, query: ProductQueryDto) {
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc', search, status, categoryId } = query

    const where: Prisma.ProductWhereInput = {
      shopId,
      deletedAt: null,
      ...(status ? { status: status as Prisma.ProductWhereInput['status'] } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { baseSku: { contains: search, mode: 'insensitive' } }] }
        : {}),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          category: { select: { id: true, name: true } },
          _count: { select: { variants: true } },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return { data: products, meta: buildPaginationMeta(page, limit, total) }
  }

  async getById(shopId: string, productId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, shopId, deletedAt: null },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: { select: { id: true, name: true } },
        variantOptionGroups: {
          orderBy: { sortOrder: 'asc' },
          include: { options: { orderBy: { sortOrder: 'asc' } } },
        },
        variants: {
          include: { optionValues: { include: { option: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product
  }

  async create(shopId: string, dto: CreateProductDto) {
    const slug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const uniqueSlug = `${slug}-${Date.now().toString(36)}`

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.create({
        data: {
          shopId,
          name: dto.name,
          slug: uniqueSlug,
          description: dto.description,
          categoryId: dto.categoryId,
          basePrice: dto.basePrice,
          baseSku: dto.baseSku,
          baseStock: dto.baseStock ?? 0,
          hasVariants: dto.hasVariants ?? false,
          weight: dto.weight,
          status: (dto.status as 'DRAFT' | 'PUBLISHED') ?? 'DRAFT',
        },
      })

      if (dto.images?.length) {
        await tx.productImage.createMany({
          data: dto.images.map((img, idx) => ({
            productId: product.id,
            url: img.url,
            alt: img.alt,
            sortOrder: idx,
            isCover: img.isCover ?? idx === 0,
          })),
        })
      }

      if (dto.hasVariants && dto.variantOptionGroups?.length) {
        for (let gi = 0; gi < dto.variantOptionGroups.length; gi++) {
          const group = dto.variantOptionGroups[gi]
          const createdGroup = await tx.productVariantOptionGroup.create({
            data: {
              productId: product.id,
              name: group.name,
              sortOrder: gi,
            },
          })

          for (let oi = 0; oi < group.options.length; oi++) {
            await tx.productVariantOption.create({
              data: {
                groupId: createdGroup.id,
                value: group.options[oi].value,
                sortOrder: oi,
              },
            })
          }
        }

        if (dto.variants?.length) {
          const allOptions = await tx.productVariantOption.findMany({
            where: { group: { productId: product.id } },
            include: { group: true },
          })

          for (const v of dto.variants) {
            const variant = await tx.productVariant.create({
              data: {
                productId: product.id,
                sku: v.sku,
                price: v.price,
                stock: v.stock,
              },
            })

            const optionIds = v.optionValues
              .map((val) => allOptions.find((o) => o.value === val)?.id)
              .filter((id): id is string => id != null)

            if (optionIds.length > 0) {
              await tx.productVariantOptionValue.createMany({
                data: optionIds.map((optionId) => ({
                  variantId: variant.id,
                  optionId,
                })),
              })
            }
          }
        }
      }

      return this.getById(shopId, product.id)
    })
  }

  async update(shopId: string, productId: string, dto: UpdateProductDto) {
    const existing = await prisma.product.findFirst({
      where: { id: productId, shopId, deletedAt: null },
    })

    if (!existing) {
      throw new NotFoundException('Product not found')
    }

    const data: Prisma.ProductUpdateInput = {}
    if (dto.name !== undefined) {
      data.name = dto.name
      data.slug =
        dto.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') + `-${Date.now().toString(36)}`
    }
    if (dto.description !== undefined) data.description = dto.description
    if (dto.categoryId !== undefined) data.category = { connect: { id: dto.categoryId } }
    if (dto.basePrice !== undefined) data.basePrice = dto.basePrice
    if (dto.baseSku !== undefined) data.baseSku = dto.baseSku
    if (dto.baseStock !== undefined) data.baseStock = dto.baseStock
    if (dto.weight !== undefined) data.weight = dto.weight
    if (dto.hasVariants !== undefined) data.hasVariants = dto.hasVariants
    if (dto.status !== undefined) data.status = dto.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

    await prisma.product.update({ where: { id: productId }, data })

    return this.getById(shopId, productId)
  }

  async delete(shopId: string, productId: string) {
    const existing = await prisma.product.findFirst({
      where: { id: productId, shopId, deletedAt: null },
    })

    if (!existing) {
      throw new NotFoundException('Product not found')
    }

    await prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    })
  }

  async bulkUpdateStatus(shopId: string, productIds: string[], status: string) {
    const result = await prisma.product.updateMany({
      where: { id: { in: productIds }, shopId, deletedAt: null },
      data: { status: status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' },
    })

    if (result.count === 0) {
      throw new BadRequestException('No products updated')
    }

    return { updated: result.count }
  }

  async bulkDelete(shopId: string, productIds: string[]) {
    const result = await prisma.product.updateMany({
      where: { id: { in: productIds }, shopId, deletedAt: null },
      data: { deletedAt: new Date() },
    })

    return { deleted: result.count }
  }

  async listCategories() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
  }
}
