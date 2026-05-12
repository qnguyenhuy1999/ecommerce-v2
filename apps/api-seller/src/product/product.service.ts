import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import type { Prisma } from '@ecom/database'
import { slugify } from '@ecom/shared/utils'
import type { CreateProductDto } from './dto/create-product.dto'
import type { UpdateProductDto } from './dto/update-product.dto'
import type { ProductQueryDto } from './dto/product-query.dto'
import { buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import type { ProductRepository } from './repositories/product.repository'
import { ProductStatus } from '@ecom/contracts'

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async list(shopId: string, query: ProductQueryDto) {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status,
      categoryId,
      sort,
      order,
    } = query

    const finalSort = sort || sortBy
    const finalOrder = order || sortOrder

    const where: Prisma.ProductWhereInput = {
      shopId,
      deletedAt: null,
    }
    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { baseSku: { contains: search, mode: 'insensitive' } },
      ]
    }

    const { items, total } = await this.productRepository.findMany(where, {
      page,
      pageSize,
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getById(shopId: string, productId: string) {
    const product = await this.productRepository.findOneWithDetails({
      id: productId,
      shopId,
      deletedAt: null,
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product
  }

  async create(shopId: string, dto: CreateProductDto) {
    const slug = slugify(dto.name)
    const uniqueSlug = `${slug}-${Date.now().toString(36)}`

    return this.productRepository.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.create({
        data: {
          shopId,
          name: dto.name,
          slug: uniqueSlug,
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
          ...(dto.basePrice !== undefined ? { basePrice: dto.basePrice } : {}),
          ...(dto.baseSku !== undefined ? { baseSku: dto.baseSku } : {}),
          baseStock: dto.baseStock ?? 0,
          hasVariants: dto.hasVariants ?? false,
          ...(dto.weight !== undefined ? { weight: dto.weight } : {}),
          status: dto.status ?? ProductStatus.DRAFT,
        },
      })

      if (dto.images?.length) {
        await tx.productImage.createMany({
          data: dto.images.map((img, idx) => ({
            productId: product.id,
            url: img.url,
            ...(img.alt !== undefined ? { alt: img.alt } : {}),
            sortOrder: idx,
            isCover: img.isCover ?? idx === 0,
          })),
        })
      }

      if (dto.hasVariants && dto.variantOptionGroups?.length) {
        for (let gi = 0; gi < dto.variantOptionGroups.length; gi++) {
          const group = dto.variantOptionGroups[gi]
          if (!group) continue
          const createdGroup = await tx.productVariantOptionGroup.create({
            data: {
              productId: product.id,
              name: group.name,
              sortOrder: gi,
            },
          })

          for (let oi = 0; oi < group.options.length; oi++) {
            const option = group.options[oi]
            if (!option) continue
            await tx.productVariantOption.create({
              data: {
                groupId: createdGroup.id,
                value: option.value,
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
                ...(v.sku !== undefined ? { sku: v.sku } : {}),
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
    const existing = await this.productRepository.findOne({
      id: productId,
      shopId,
      deletedAt: null,
    })

    if (!existing) {
      throw new NotFoundException('Product not found')
    }

    const data: Prisma.ProductUpdateInput = {}
    if (dto.name !== undefined) {
      data.name = dto.name
      data.slug = slugify(dto.name) + `-${Date.now().toString(36)}`
    }
    if (dto.description !== undefined) data.description = dto.description
    if (dto.categoryId !== undefined) data.category = { connect: { id: dto.categoryId } }
    if (dto.basePrice !== undefined) data.basePrice = dto.basePrice
    if (dto.baseSku !== undefined) data.baseSku = dto.baseSku
    if (dto.baseStock !== undefined) data.baseStock = dto.baseStock
    if (dto.weight !== undefined) data.weight = dto.weight
    if (dto.hasVariants !== undefined) data.hasVariants = dto.hasVariants
    if (dto.status !== undefined) data.status = dto.status

    await this.productRepository.update(productId, data)

    return this.getById(shopId, productId)
  }

  async delete(shopId: string, productId: string) {
    const existing = await this.productRepository.findOne({
      id: productId,
      shopId,
      deletedAt: null,
    })

    if (!existing) {
      throw new NotFoundException('Product not found')
    }

    await this.productRepository.update(productId, { deletedAt: new Date() })
  }

  async bulkUpdateStatus(shopId: string, productIds: string[], status: ProductStatus) {
    const result = await this.productRepository.updateMany(
      { id: { in: productIds }, shopId, deletedAt: null },
      { status },
    )

    if (result.count === 0) {
      throw new BadRequestException('No products updated')
    }

    return { updated: result.count }
  }

  async bulkDelete(shopId: string, productIds: string[]) {
    const result = await this.productRepository.updateMany(
      { id: { in: productIds }, shopId, deletedAt: null },
      { deletedAt: new Date() },
    )

    return { deleted: result.count }
  }

  async listCategories() {
    return this.productRepository.findCategories()
  }
}
