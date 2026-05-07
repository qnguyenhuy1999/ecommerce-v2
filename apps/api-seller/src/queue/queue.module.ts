import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { BulkJobProcessor } from './processors/bulk-job.processor'
import { MetricsSnapshotProcessor } from './processors/metrics-snapshot.processor'
import { BulkModule } from '../bulk/bulk.module'
import { MetricsModule } from '../metrics/metrics.module'

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue(
      { name: 'bulk-jobs' },
      { name: 'metrics-snapshots' },
    ),
    BulkModule,
    MetricsModule,
  ],
  providers: [BulkJobProcessor, MetricsSnapshotProcessor],
})
export class QueueModule {}
