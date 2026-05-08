import { Injectable, Logger } from '@nestjs/common';
import { prisma, type AuditActionType } from '@ecom/database';
import { buildPaginationMeta } from '@ecom/common';

interface LogParams {
  adminId: string;
  action: AuditActionType;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  async log(params: LogParams) {
    try {
      await prisma.adminAuditLog.create({
        data: {
          adminId: params.adminId,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          metadata: params.metadata ?? undefined,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
    }
  }

  async findAll(query: {
    page?: number;
    pageSize?: number;
    action?: AuditActionType;
    adminId?: string;
  }) {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.action) where.action = query.action;
    if (query.adminId) where.adminId = query.adminId;

    const [items, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where,
        include: {
          admin: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.adminAuditLog.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, pageSize, total) };
  }
}
