import { Inject, Injectable, Logger, UnauthorizedException, ConflictException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import * as bcrypt from 'bcrypt'
import { prisma } from '@ecom/database'
import { SessionService, type SessionData } from '@ecom/auth'
import { EmailService } from '@ecom/email'
import { RedisService } from '@ecom/redis'
import { SESSION_SERVICE } from './session.provider'

const BCRYPT_ROUNDS = 12
const SESSION_EXPIRY_DAYS = 7
const VERIFY_TOKEN_TTL = 24 * 60 * 60 // 24 hours
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

  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)

    const buyerRole = await prisma.role.findUnique({
      where: { name: 'buyer' },
    })
    if (!buyerRole) {
      throw new Error('Default buyer role not found. Run db:seed first.')
    }

    let user
    try {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          userRoles: {
            create: { roleId: buyerRole.id },
          },
        },
        include: { userRoles: { include: { role: true } } },
      })
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2002') {
        throw new ConflictException('Email already registered')
      }
      throw err
    }

    // Generate a cryptographic verification token (not the user ID)
    const verifyToken = randomUUID()
    this.redisService
      .set(`verify:${verifyToken}`, user.id, VERIFY_TOKEN_TTL)
      .then(() =>
        this.emailService.sendMail({
          to: user.email,
          subject: 'Verify your email',
          templatePath: join(TEMPLATES_DIR, 'verify-email.hbs'),
          context: {
            name: user.email,
            link: `${process.env.APP_URL ?? 'http://localhost:3000'}/verify?token=${verifyToken}`,
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

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const roles = user.userRoles.map((ur: { role: { name: string } }) => ur.role.name)
    const sessionId = randomUUID()
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

    // Store in Redis
    const sessionData: SessionData = { userId: user.id, roles }
    await this.sessionService.create(sessionId, sessionData)

    // Store in database for audit
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        userAgent,
        ipAddress,
        expiresAt,
      },
    })

    return { sessionId, userId: user.id, roles }
  }

  async logout(sessionId: string) {
    await this.sessionService.delete(sessionId)
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {
      // Session may not exist in DB, ignore
    })
  }

  async getMe(sessionId: string) {
    const session = await this.sessionService.get(sessionId)
    if (!session) {
      throw new UnauthorizedException('Session expired or invalid')
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      roles: session.roles,
    }
  }

  async validateSession(sessionId: string): Promise<SessionData | null> {
    return this.sessionService.get(sessionId)
  }
}
