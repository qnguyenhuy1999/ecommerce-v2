import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, type BannerPosition, type BannerStatus } from '@ecom/database';
import { offsetPaginate, buildOffsetResponse } from '@ecom/pagination';

@Injectable()
export class BannersService {
  async findAll(query: {
    page?: number;
    pageSize?: number;
    position?: BannerPosition;
    status?: BannerStatus;
  }) {
    const where: Record<string, unknown> = {};
    if (query.position) where.position = query.position;
    if (query.status) where.status = query.status;

    const { items, total } = await offsetPaginate(prisma.banner, {
      page: query.page,
      pageSize: query.pageSize,
      where,
      orderBy: { sortOrder: 'asc' },
    });

    return buildOffsetResponse(items, query.page ?? 1, query.pageSize ?? 20, total);
  }

  async findById(id: string) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async create(data: {
    title: string; position: BannerPosition; imageUrl: string;
    mobileImageUrl?: string; linkUrl?: string; sortOrder?: number;
    startsAt?: Date; endsAt?: Date; createdBy?: string;
  }) {
    return prisma.banner.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    await this.findById(id);
    return prisma.banner.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    return prisma.banner.delete({ where: { id } });
  }
}
