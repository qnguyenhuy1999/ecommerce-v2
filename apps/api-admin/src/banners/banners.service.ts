import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, type BannerPosition, type BannerStatus } from '@ecom/database';
import { buildPaginationMeta } from '@ecom/common';

@Injectable()
export class BannersService {
  async findAll(query: {
    page?: number;
    pageSize?: number;
    position?: BannerPosition;
    status?: BannerStatus;
  }) {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.position) where.position = query.position;
    if (query.status) where.status = query.status;

    const [items, total] = await Promise.all([
      prisma.banner.findMany({ where, orderBy: { sortOrder: 'asc' }, skip, take: pageSize }),
      prisma.banner.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, pageSize, total) };
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
