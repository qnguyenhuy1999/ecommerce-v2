import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { prisma } from '@ecom/database'
import { MetricsService } from '../../metrics/metrics.service'

@Processor('metrics-snapshots')
export class MetricsSnapshotProcessor extends WorkerHost {
  private readonly logger = new Logger(MetricsSnapshotProcessor.name)

  constructor(private readonly metricsService: MetricsService) {
    super()
  }

  async process(job: Job<{ shopId?: string }>) {
    this.logger.log('Running daily metrics snapshot job')

    try {
      const shopId = job.data.shopId

      if (shopId) {
        await this.metricsService.takeSnapshot(shopId)
        this.logger.log(`Snapshot taken for shop ${shopId}`)
      } else {
        const shops = await prisma.shop.findMany({ select: { id: true } })
        for (const shop of shops) {
          try {
            await this.metricsService.takeSnapshot(shop.id)
          } catch (error) {
            this.logger.error(`Failed to take snapshot for shop ${shop.id}`, error)
          }
        }
        this.logger.log(`Snapshots taken for ${shops.length} shops`)
      }
    } catch (error) {
      this.logger.error('Metrics snapshot job failed', error)
      throw error
    }
  }
}
