import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService, Prisma } from '@ecom/database'
import { type BannerPosition, type BannerStatus } from '@ecom/database'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils'

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: {
    page?: number
    limit?: number
    position?: BannerPosition
    status?: BannerStatus
  }) {
    const where: Prisma.BannerWhereInput = {}
    if (query.position) where.position = query.position
    if (query.status) where.status = query.status

    const { items, total } = await offsetPaginate(this.prisma.banner, {
      ...withDefined({ page: query.page, limit: query.limit }),
      where,
      orderBy: { sortOrder: 'asc' },
    })

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total)
  }

  async findById(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } })
    if (!banner) throw new NotFoundException('Banner not found')
    return banner
  }

  async create(data: {
    title: string
    position: BannerPosition
    imageUrl: string
    mobileImageUrl?: string
    linkUrl?: string
    sortOrder?: number
    startsAt?: Date
    endsAt?: Date
    createdBy?: string
  }) {
    const createData: Parameters<typeof this.prisma.banner.create>[0]['data'] = {
      title: data.title,
      position: data.position,
      imageUrl: data.imageUrl,
      ...(data.mobileImageUrl !== undefined ? { mobileImageUrl: data.mobileImageUrl } : {}),
      ...(data.linkUrl !== undefined ? { linkUrl: data.linkUrl } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      ...(data.startsAt !== undefined ? { startsAt: data.startsAt } : {}),
      ...(data.endsAt !== undefined ? { endsAt: data.endsAt } : {}),
      ...(data.createdBy !== undefined ? { createdBy: data.createdBy } : {}),
    }
    return this.prisma.banner.create({ data: createData })
  }

  async update(id: string, data: Prisma.BannerUpdateInput) {
    await this.findById(id)
    return this.prisma.banner.update({ where: { id }, data })
  }

  async delete(id: string) {
    await this.findById(id)
    return this.prisma.banner.delete({ where: { id } })
  }
}
