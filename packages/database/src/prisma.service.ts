import { Injectable, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { loadDatabaseEnv } from '../env'

loadDatabaseEnv()

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const shouldSkipConnection = process.env['GENERATE_SWAGGER'] === 'true'
    const adapter = new PrismaPg({
      connectionString:
        process.env['DATABASE_URL'] ??
        (shouldSkipConnection ? 'postgresql://localhost:5432/openapi' : undefined),
    })
    super({ adapter })
  }

  async onModuleInit() {
    if (process.env['GENERATE_SWAGGER'] === 'true') {
      return
    }
    await this.$connect()
  }

  async onModuleDestroy() {
    if (process.env['GENERATE_SWAGGER'] === 'true') {
      return
    }
    await this.$disconnect()
  }
}
