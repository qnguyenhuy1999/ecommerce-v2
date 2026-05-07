import { Injectable } from '@nestjs/common';
import { prisma } from '@ecom/database';

@Injectable()
export class DashboardService {
  async getMetrics() {
    const [
      totalSellers,
      activeSellers,
      pendingSellers,
      totalUsers,
      recentSellers,
    ] = await Promise.all([
      prisma.seller.count({ where: { deletedAt: null } }),
      prisma.seller.count({
        where: { status: 'ACTIVE', deletedAt: null },
      }),
      prisma.seller.count({
        where: { status: 'PENDING', deletedAt: null },
      }),
      prisma.user.count(),
      prisma.seller.findMany({
        where: { deletedAt: null },
        include: {
          user: { select: { email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalSellers,
      activeSellers,
      pendingSellers,
      totalUsers,
      recentSellers,
    };
  }
}
