import { DynamicModule, Module, Logger } from '@nestjs/common'
import Redis from 'ioredis'
import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants'
import { RedisService } from './redis.service'
import type { RedisModuleOptions } from './redis.types'

@Module({})
export class RedisModule {
  private static readonly logger = new Logger(RedisModule.name)

  static forRoot(options: RedisModuleOptions): DynamicModule {
    const redisClientProvider = {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const client = new Redis({
          host: options.host,
          port: options.port,
          password: options.password,
          db: options.db ?? 0,
          keyPrefix: options.keyPrefix,
          maxRetriesPerRequest: options.maxRetriesPerRequest ?? 3,
          retryStrategy: (times: number) => {
            if (times > 10) return null
            return Math.min(times * 200, 2000)
          },
        })

        client.on('connect', () => {
          RedisModule.logger.log('Redis connected')
        })

        client.on('error', (err: Error) => {
          RedisModule.logger.error('Redis connection error', err.message)
        })

        return client
      },
    }

    const optionsProvider = {
      provide: REDIS_MODULE_OPTIONS,
      useValue: options,
    }

    return {
      module: RedisModule,
      global: true,
      providers: [redisClientProvider, optionsProvider, RedisService],
      exports: [RedisService, REDIS_CLIENT],
    }
  }
}
