import type { EmailServiceBase } from '@ecom/email'
import type { RedisService } from '@ecom/redis'
import type { SessionService } from './session.service'

export interface AuthPrismaClient {
  session: {
    delete(args: { where: { id: string } }): Promise<unknown>
  }
  user: {
    update(args: { where: { id: string }; data: { emailVerified: boolean } }): Promise<unknown>
  }
}

export abstract class BaseUserAuthService<TPrisma extends AuthPrismaClient = AuthPrismaClient> {
  constructor(
    protected readonly sessionService: SessionService,
    protected readonly emailService: EmailServiceBase,
    protected readonly redisService: RedisService,
    protected readonly prisma: TPrisma,
  ) {}

  async destroySession(sessionId: string): Promise<void> {
    await this.sessionService.delete(sessionId)
    await this.prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
  }

  async verifyEmail(token: string): Promise<void> {
    const userId = await this.redisService.get(`verify:${token}`)
    if (!userId) {
      throw new Error('Invalid or expired verification token')
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    })

    await this.redisService.del(`verify:${token}`)
  }
}
