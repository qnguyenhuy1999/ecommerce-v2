import { Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'

/**
 * Shared Pino logger module for all NestJS apps.
 * Provides structured JSON logging in production and pretty-printing in development.
 *
 * Usage in app.module.ts:
 *   import { EcomLoggerModule } from '@ecom/nestjs-core'
 *   @Module({ imports: [EcomLoggerModule] })
 */
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        ...(process.env.NODE_ENV !== 'production'
          ? { transport: { target: 'pino-pretty', options: { colorize: true, singleLine: true } } }
          : {}),
        autoLogging: {
          ignore: (req) => {
            const url = (req as { url?: string }).url ?? ''
            // Skip health-check noise
            return url === '/health' || url === '/readiness'
          },
        },
        // Attach request-id for correlation
        genReqId: (req) => {
          return (
            (req.headers as Record<string, string | undefined>)['x-request-id'] ??
            crypto.randomUUID()
          )
        },
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class EcomLoggerModule {}
