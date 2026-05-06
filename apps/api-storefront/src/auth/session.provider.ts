import { Provider } from '@nestjs/common';
import { SessionService } from '@ecom/auth';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.provider';

export const SESSION_SERVICE = 'SESSION_SERVICE';

export const SessionProvider: Provider = {
  provide: SESSION_SERVICE,
  useFactory: (redis: Redis) => {
    return new SessionService({ redis });
  },
  inject: [REDIS_CLIENT],
};
