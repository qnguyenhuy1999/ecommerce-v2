import { prisma } from '@ecom/database';
import { EmailServiceBase } from '@ecom/email';
import { RedisService } from '@ecom/redis';
import { SessionService } from './session.service';

export abstract class BaseUserAuthService {
  constructor(
    protected readonly sessionService: SessionService,
    protected readonly emailService: EmailServiceBase,
    protected readonly redisService: RedisService,
  ) {}

  async destroySession(sessionId: string): Promise<void> {
    await this.sessionService.delete(sessionId);
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
  }

  async verifyEmail(token: string): Promise<void> {
    const userId = await this.redisService.get(`verify:${token}`);
    if (!userId) {
      throw new Error('Invalid or expired verification token');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    await this.redisService.del(`verify:${token}`);
  }
}
