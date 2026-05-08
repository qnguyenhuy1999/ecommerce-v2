import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import * as bcrypt from 'bcrypt'
import { prisma, Prisma } from '@ecom/database'
import { SessionService, type SessionData } from '@ecom/auth'
import { EmailService } from '@ecom/email'
import { RedisService } from '@ecom/redis'
import { SESSION_SERVICE } from './session.provider'

const BCRYPT_ROUNDS = 12
const SESSION_EXPIRY_DAYS = 7
const VERIFY_TOKEN_TTL = 24 * 60 * 60
const RESET_TOKEN_TTL = 60 * 60
const TEMPLATES_DIR = join(__dirname, '..', 'email', 'templates')

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(SESSION_SERVICE)
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

  async register(email: string, password: string, shopName?: string) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)

    const sellerRole = await prisma.role.findUnique({ where: { name: 'seller' } })
    if (!sellerRole) {
      throw new Error('Default seller role not found. Run db:seed first.')
    }

    let user
    try {
      user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const created = await tx.user.create({
          data: {
            email,
            passwordHash,
            userRoles: { create: { roleId: sellerRole.id } },
          },
          include: { userRoles: { include: { role: true } } },
        })

        const profile = await tx.sellerProfile.create({
          data: { userId: created.id },
        })

        if (shopName) {
          const slug = shopName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
          await tx.shop.create({
            data: {
              sellerId: profile.id,
              name: shopName,
              slug: `${slug}-${created.id.slice(0, 8)}`,
            },
          })
        }

        return created
      })
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2002') {
        throw new ConflictException('Email already registered')
      }
      throw err
    }

    const verifyToken = randomUUID()
    this.redisService
      .set(`verify:${verifyToken}`, user.id, VERIFY_TOKEN_TTL)
      .then(() =>
        this.emailService.sendMail({
          to: user.email,
          subject: 'Verify your seller account',
          templatePath: join(TEMPLATES_DIR, 'verify-email.hbs'),
          context: {
            name: user.email,
            link: `${process.env.APP_URL ?? 'http://localhost:3001'}/verify?token=${verifyToken}`,
          },
        }),
      )
      .catch((err) => {
        this.logger.warn(`Failed to send verification email: ${err.message}`)
      })

    return {
      id: user.id,
      email: user.email,
      roles: user.userRoles.map((ur: { role: { name: string } }) => ur.role.name),
    }
  }

  async login(email: string, password: string, userAgent?: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { userRoles: { include: { role: true } } },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active')
    }

    const isSeller = user.userRoles.some(
      (ur: { role: { name: string } }) => ur.role.name === 'seller',
    )
    if (!isSeller) {
      throw new UnauthorizedException('Not a seller account')
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const roles = user.userRoles.map((ur: { role: { name: string } }) => ur.role.name)
    const sessionId = randomUUID()
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

    const sessionData: SessionData = { userId: user.id, roles }
    await this.sessionService.create(sessionId, sessionData)

    await prisma.session.create({
      data: { id: sessionId, userId: user.id, userAgent, ipAddress, expiresAt },
    })

    return { sessionId, userId: user.id, roles }
  }

  async logout(sessionId: string) {
    await this.sessionService.delete(sessionId)
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
  }

  async getMe(sessionId: string) {
    const session = await this.sessionService.get(sessionId)
    if (!session) {
      throw new UnauthorizedException('Session expired or invalid')
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        sellerProfile: { include: { shop: { select: { id: true, name: true, status: true } } } },
      },
    })

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is not active')
    }

    return {
      userId: session.userId,
      roles: session.roles,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      emailVerified: user?.emailVerified,
      shop: user?.sellerProfile?.shop ?? null,
    }
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return

    const token = randomUUID()
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL * 1000),
      },
    })

    this.emailService
      .sendMail({
        to: user.email,
        subject: 'Reset your password',
        templatePath: join(TEMPLATES_DIR, 'reset-password.hbs'),
        context: {
          name: user.email,
          link: `${process.env.APP_URL ?? 'http://localhost:3001'}/reset-password?token=${token}`,
        },
      })
      .catch((err) => {
        this.logger.warn(`Failed to send reset email: ${err.message}`)
      })
  }

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token')
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ])
  }

  async verifyEmail(token: string) {
    const userId = await this.redisService.get(`verify:${token}`)
    if (!userId) {
      throw new BadRequestException('Invalid or expired verification token')
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    })

    await this.redisService.del(`verify:${token}`)
  }
}
