import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import type { Prisma } from '@ecom/database'
import { slugify } from '@ecom/shared/utils'
import type {
  CreateProductDto,
  ProductImageDto,
  ProductVariantDto,
  VariantOptionGroupDto,
  VariantOptionValueDto,
} from './dto/create-product.dto'
import type { UpdateProductDto } from './dto/update-product.dto'
import type { ProductQueryDto } from './dto/product-query.dto'
import { buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { ProductRepository } from './repositories/product.repository'
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
      const product = await this.createProduct(tx, shopId, dto, uniqueSlug)
      await this.createImages(tx, product.id, dto.images)
      await this.createVariantsIfNeeded(tx, product.id, dto)

      return this.getById(shopId, product.id)
    })
  }

  private async createProduct(
    tx: Prisma.TransactionClient,
    shopId: string,
    dto: CreateProductDto,
    uniqueSlug: string,
  ) {
    return tx.product.create({
      data: {
        shopId,
        name: dto.name,
        slug: uniqueSlug,
        ...this.buildOptionalFields(dto),
        baseStock: dto.baseStock ?? 0,
        hasVariants: dto.hasVariants ?? false,
        status: dto.status ?? ProductStatus.DRAFT,
      },
    })
  }

  private buildOptionalFields(dto: CreateProductDto) {
    return {
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
      ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
      ...(dto.baseSku !== undefined && { baseSku: dto.baseSku }),
      ...(dto.weight !== undefined && { weight: dto.weight }),
    }
  }

  private async createImages(
    tx: Prisma.TransactionClient,
    productId: string,
    images?: ProductImageDto[],
  ) {
    if (!images?.length) return

    await tx.productImage.createMany({
      data: images.map((img, idx) => ({
        productId,
        url: img.url,
        ...(img.alt !== undefined && { alt: img.alt }),
        sortOrder: idx,
        isCover: img.isCover ?? idx === 0,
      })),
    })
  }

  private async createVariantsIfNeeded(
    tx: Prisma.TransactionClient,
    productId: string,
    dto: CreateProductDto,
  ) {
    if (!dto.hasVariants || !dto.variantOptionGroups?.length) return

    await this.createVariantOptionGroups(tx, productId, dto.variantOptionGroups)
    await this.createVariants(tx, productId, dto.variants)
  }

  private async createVariantOptionGroups(
    tx: Prisma.TransactionClient,
    productId: string,
    groups: VariantOptionGroupDto[],
  ) {
    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi]
      if (!group) continue

      const createdGroup = await tx.productVariantOptionGroup.create({
        data: { productId, name: group.name, sortOrder: gi },
      })

      await this.createVariantOptions(tx, createdGroup.id, group.options)
    }
  }

  private async createVariantOptions(
    tx: Prisma.TransactionClient,
    groupId: string,
    options: VariantOptionValueDto[],
  ) {
    for (let oi = 0; oi < options.length; oi++) {
      const option = options[oi]
      if (!option) continue

      await tx.productVariantOption.create({
        data: { groupId, value: option.value, sortOrder: oi },
      })
    }
  }

  private async createVariants(
    tx: Prisma.TransactionClient,
    productId: string,
    variants?: ProductVariantDto[],
  ) {
    if (!variants?.length) return

    const allOptions = await tx.productVariantOption.findMany({
      where: { group: { productId } },
      include: { group: true },
    })

    for (const v of variants) {
      const variant = await tx.productVariant.create({
        data: {
          productId,
          ...(v.sku !== undefined && { sku: v.sku }),
          price: v.price,
          stock: v.stock,
        },
      })

      await this.linkVariantOptions(tx, variant.id, v.optionValues, allOptions)
    }
  }

  private async linkVariantOptions(
    tx: Prisma.TransactionClient,
    variantId: string,
    optionValues: string[],
    allOptions: { id: string; value: string }[],
  ) {
    const optionIds = this.mapVariantOptionIds(optionValues, allOptions)
    if (optionIds.length === 0) return

    await tx.productVariantOptionValue.createMany({
      data: optionIds.map((optionId) => ({ variantId, optionId })),
    })
  }

  private mapVariantOptionIds(
    optionValues: string[],
    allOptions: { id: string; value: string }[],
  ): string[] {
    return optionValues
      .map((val) => allOptions.find((o) => o.value === val)?.id)
      .filter((id): id is string => id != null)
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
