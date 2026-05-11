import type { Provider } from '@nestjs/common'
import { SessionService } from '@ecom/auth'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'

export const SESSION_SERVICE = 'ADMIN_SESSION_SERVICE'

export const SessionProvider: Provider = {
  provide: SESSION_SERVICE,
  useFactory: (redis: Redis) => {
    return new SessionService({ redis, prefix: 'admin-session:' })
  },
  inject: [REDIS_CLIENT],
}
