import { Injectable, Logger } from '@nestjs/common';
import { PrismaService, type AuditActionType, Prisma } from '@ecom/database';
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma';

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
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(AuditLogService.name);

  async log(params: LogParams) {
    try {
      await this.prisma.adminAuditLog.create({
        data: {
          adminId: params.adminId,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          metadata: params.metadata ? (params.metadata as Prisma.InputJsonValue) : undefined,
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
    limit?: number;
    action?: AuditActionType;
    adminId?: string;
  }) {
    const where: Prisma.AdminAuditLogWhereInput = {};
    if (query.action) where.action = query.action;
    if (query.adminId) where.adminId = query.adminId;

    const { items, total } = await offsetPaginate(this.prisma.adminAuditLog, {
      page: query.page,
      limit: query.limit,
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total);
  }
}
