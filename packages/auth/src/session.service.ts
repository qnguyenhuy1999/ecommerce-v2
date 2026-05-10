import Redis from 'ioredis'

export interface SessionData {
  userId: string
  roles: string[]
}

export interface SessionServiceOptions {
  redis: Redis
  ttlSeconds?: number
  prefix?: string
}

const DEFAULT_TTL = 7 * 24 * 60 * 60 // 7 days
const DEFAULT_PREFIX = 'session:'

export class SessionService {
  private readonly redis: Redis
  private readonly ttl: number
  private readonly prefix: string

  constructor(options: SessionServiceOptions) {
    this.redis = options.redis
    this.ttl = options.ttlSeconds ?? DEFAULT_TTL
    this.prefix = options.prefix ?? DEFAULT_PREFIX
  }

  private key(sessionId: string): string {
    return `${this.prefix}${sessionId}`
  }

  async create(sessionId: string, data: SessionData): Promise<void> {
    await this.redis.set(this.key(sessionId), JSON.stringify(data), 'EX', this.ttl)
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const raw = await this.redis.get(this.key(sessionId))
    if (!raw) return null
    return JSON.parse(raw) as SessionData
  }

  async delete(sessionId: string): Promise<void> {
    await this.redis.del(this.key(sessionId))
  }

  async refresh(sessionId: string): Promise<void> {
    await this.redis.expire(this.key(sessionId), this.ttl)
  }
}
