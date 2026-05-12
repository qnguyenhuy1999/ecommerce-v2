import { Injectable, Logger } from '@nestjs/common'
import type { PrismaService, Prisma } from '@ecom/database'
import { type AuditActionType } from '@ecom/database'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { withDefined, nullable } from '@ecom/shared/utils'

interface LogParams {
  adminId: string
  action: AuditActionType
  entityType?: string
  entityId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(AuditLogService.name)

  async log(params: LogParams) {
    try {
      await this.prisma.adminAuditLog.create({
        data: {
          adminId: params.adminId,
          action: params.action,
          entityType: nullable(params.entityType),
          entityId: nullable(params.entityId),
          ...(params.metadata !== undefined
            ? { metadata: params.metadata as Prisma.InputJsonValue }
            : {}),
          ipAddress: nullable(params.ipAddress),
          userAgent: nullable(params.userAgent),
        },
      })
    } catch (error) {
      this.logger.error('Failed to create audit log', error)
    }
  }

  async findAll(query: {
    page?: number
    limit?: number
    action?: AuditActionType
    adminId?: string
  }) {
    const where: Prisma.AdminAuditLogWhereInput = {}
    if (query.action) where.action = query.action
    if (query.adminId) where.adminId = query.adminId

    const { items, total } = await offsetPaginate(this.prisma.adminAuditLog, {
      ...withDefined({ page: query.page, limit: query.limit }),
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    })

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total)
  }
}
