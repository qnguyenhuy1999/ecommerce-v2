import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { BulkJobQueryDto } from './dto/bulk-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'

@Injectable()
export class BulkService {
  constructor(private readonly prisma: PrismaService) {}
  async listJobs(shopId: string, query: BulkJobQueryDto) {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      type,
      status,
      sort,
      order,
    } = query

    const finalSort = sort || sortBy
    const finalOrder = order || sortOrder

    const where: Prisma.BulkJobWhereInput = {
      shopId,
      ...(type ? { type: type as Prisma.BulkJobWhereInput['type'] } : {}),
      ...(status ? { status: status as Prisma.BulkJobWhereInput['status'] } : {}),
    }

    const { items, total } = await offsetPaginate(this.prisma.bulkJob, {
      page,
      pageSize,
      where,
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, pageSize, total)
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

  async createImportJob(shopId: string, fileName: string, fileUrl: string, type: 'PRODUCT_IMPORT' | 'INVENTORY_UPDATE' | 'PRICE_UPDATE') {
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

  async updateJobProgress(jobId: string, data: { processedRows?: number; successRows?: number; errorRows?: number; status?: string; errors?: unknown; resultUrl?: string }) {
    const updateData: Prisma.BulkJobUpdateInput = {}
    if (data.processedRows !== undefined) updateData.processedRows = data.processedRows
    if (data.successRows !== undefined) updateData.successRows = data.successRows
    if (data.errorRows !== undefined) updateData.errorRows = data.errorRows
    if (data.status !== undefined) updateData.status = data.status as Prisma.BulkJobUpdateInput['status']
    if (data.errors !== undefined) updateData.errors = data.errors as Prisma.InputJsonValue
    if (data.resultUrl !== undefined) updateData.resultUrl = data.resultUrl

    if (data.status === 'PROCESSING') updateData.startedAt = new Date()
    if (data.status === 'COMPLETED' || data.status === 'FAILED' || data.status === 'PARTIALLY_COMPLETED') {
      updateData.completedAt = new Date()
    }

    return this.prisma.bulkJob.update({ where: { id: jobId }, data: updateData })
  }
}
