import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: Prisma.ProductWhereInput,
    options: {
      page: number
      limit: number
      orderBy: Prisma.ProductOrderByWithRelationInput
    },
  ) {
    return offsetPaginate(this.prisma.product, {
      page: options.page,
      limit: options.limit,
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        category: { select: { id: true, name: true } },
        _count: { select: { variants: true } },
      },
      orderBy: options.orderBy,
    })
  }

  async findOne(where: Prisma.ProductWhereInput) {
    return this.prisma.product.findFirst({ where })
  }

  async findOneWithDetails(where: Prisma.ProductWhereInput) {
    return this.prisma.product.findFirst({
      where,
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
  }

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data })
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data })
  }

  async updateMany(where: Prisma.ProductWhereInput, data: Prisma.ProductUpdateManyMutationInput) {
    return this.prisma.product.updateMany({ where, data })
  }

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn)
  }

  async createImageMany(data: Prisma.ProductImageCreateManyInput[]) {
    return this.prisma.productImage.createMany({ data })
  }

  async createVariantOptionGroup(data: Prisma.ProductVariantOptionGroupCreateInput) {
    return this.prisma.productVariantOptionGroup.create({ data })
  }

  async createVariantOption(data: Prisma.ProductVariantOptionCreateInput) {
    return this.prisma.productVariantOption.create({ data })
  }

  async createVariant(data: Prisma.ProductVariantCreateInput) {
    return this.prisma.productVariant.create({ data })
  }

  async createVariantOptionValueMany(data: Prisma.ProductVariantOptionValueCreateManyInput[]) {
    return this.prisma.productVariantOptionValue.createMany({ data })
  }

  async findVariantOptions(where: Prisma.ProductVariantOptionWhereInput) {
    return this.prisma.productVariantOption.findMany({
      where,
      include: { group: true },
    })
  }

  async findCategories() {
    return this.prisma.category.findMany({
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
