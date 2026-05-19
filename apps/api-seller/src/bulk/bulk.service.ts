import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Injectable, NotFoundException } from '@nestjs/common'
import type { BulkJobQueryDto } from './dto/bulk-query.dto'

@Injectable()
export class BulkService {
  constructor(private readonly prisma: PrismaService) {}
  async listJobs(shopId: string, query: BulkJobQueryDto) {
    const {
      page = 1,
      limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      type,
      status,
    } = query

    const finalSort = sortBy
    const finalOrder = sortOrder

    const where: Prisma.BulkJobWhereInput = { shopId }
    if (type) where.type = type as NonNullable<Prisma.BulkJobWhereInput['type']>
    if (status) where.status = status as NonNullable<Prisma.BulkJobWhereInput['status']>

    const { items, total } = await offsetPaginate(this.prisma.bulkJob, {
      page,
      limit,
      where,
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getJob(shopId: string, jobId: string) {
    const job = await this.prisma.bulkJob.findFirst({
      where: { id: jobId, shopId },
    })

    if (!job) {
      throw new NotFoundException('Bulk job not found')
    }

    return job
  }

  async createImportJob(
    shopId: string,
    fileName: string,
    fileUrl: string,
    type: 'PRODUCT_IMPORT' | 'INVENTORY_UPDATE' | 'PRICE_UPDATE',
  ) {
    return this.prisma.bulkJob.create({
      data: {
        shopId,
        type,
        fileName,
        fileUrl,
        status: 'QUEUED',
      },
    })
  }

  async createExportJob(shopId: string, fileName: string) {
    return this.prisma.bulkJob.create({
      data: {
        shopId,
        type: 'PRODUCT_EXPORT',
        fileName,
        status: 'QUEUED',
      },
    })
  }

  async updateJobProgress(
    jobId: string,
    data: {
      processedRows?: number
      successRows?: number
      errorRows?: number
      status?: string
      errors?: unknown
      resultUrl?: string
    },
  ) {
    const updateData: Prisma.BulkJobUpdateInput = {}
    if (data.processedRows !== undefined) updateData.processedRows = data.processedRows
    if (data.successRows !== undefined) updateData.successRows = data.successRows
    if (data.errorRows !== undefined) updateData.errorRows = data.errorRows
    if (data.status !== undefined)
      updateData.status = data.status as NonNullable<Prisma.BulkJobUpdateInput['status']>
    if (data.errors !== undefined) updateData.errors = data.errors as Prisma.InputJsonValue
    if (data.resultUrl !== undefined) updateData.resultUrl = data.resultUrl

    if (data.status === 'PROCESSING') updateData.startedAt = new Date()
    if (
      data.status === 'COMPLETED' ||
      data.status === 'FAILED' ||
      data.status === 'PARTIALLY_COMPLETED'
    ) {
      updateData.completedAt = new Date()
    }

    return this.prisma.bulkJob.update({ where: { id: jobId }, data: updateData })
  }
}
