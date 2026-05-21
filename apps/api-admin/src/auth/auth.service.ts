import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import * as bcrypt from 'bcrypt'
import type { PrismaService } from '@ecom/database'
import type { SessionService } from '@ecom/auth'
import { type SessionData } from '@ecom/auth'
import { RESET_TOKEN_TTL, hashPassword } from '@ecom/auth'
import type { EmailService } from '@ecom/email'
import { AdminStatus } from '@ecom/contracts/enums'
import { SESSION_SERVICE } from './session.provider'
import type { AdminSessionData } from './decorators/current-admin.decorator'

const SESSION_EXPIRY_DAYS = 7
const TEMPLATES_DIR = join(__dirname, '..', 'email', 'templates')

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SESSION_SERVICE)
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
  ) {}

  async login(email: string, password: string, userAgent?: string, ipAddress?: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email, deletedAt: null },
      include: {
        adminRoles: {
          include: {
            adminRole: {
              include: { permissions: true },
            },
          },
        },
      },
    })

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (admin.status !== AdminStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active')
    }

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const roles: string[] = admin.adminRoles.map(
      (ar: { adminRole: { name: string } }) => ar.adminRole.name,
    )
    const permissionSet = new Set<string>()
    for (const ar of admin.adminRoles) {
      for (const p of (ar as { adminRole: { permissions: { permission: string }[] } }).adminRole
        .permissions) {
        permissionSet.add(p.permission)
      }
    }
    const permissions: string[] = [...permissionSet]

    const sessionId = randomUUID()
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

    const sessionData: SessionData & AdminSessionData = {
      userId: admin.id,
      adminId: admin.id,
      permissions,
      roles,
    }
    await this.sessionService.create(sessionId, sessionData)

    await this.prisma.adminSession.create({
      data: {
        id: sessionId,
        adminId: admin.id,
        userAgent: userAgent ?? null,
        ipAddress: ipAddress ?? null,
        expiresAt,
      },
    })

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })

    return {
      sessionId,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        avatar: admin.avatar,
        emailVerified: admin.emailVerified,
        roles,
        permissions,
      },
    }
  }

  async logout(sessionId: string) {
    await this.sessionService.delete(sessionId)
    await this.prisma.adminSession.delete({ where: { id: sessionId } }).catch(() => {})
  }

  async getMe(sessionId: string) {
    const session = await this.sessionService.get(sessionId)
    if (!session) {
      throw new UnauthorizedException('Session expired or invalid')
    }

    const adminSession = parseAdminSessionData(session)
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminSession.adminId, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        status: true,
        emailVerified: true,
      },
    })

    if (!admin || admin.status !== AdminStatus.ACTIVE) {
      throw new UnauthorizedException('Admin account not found or inactive')
    }

    return {
      ...admin,
      roles: adminSession.roles,
      permissions: adminSession.permissions,
    }
  }

  async refreshSession(sessionId: string) {
    await this.sessionService.refresh(sessionId)
  }

  async forgotPassword(email: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email, deletedAt: null },
    })
    if (!admin || admin.status !== AdminStatus.ACTIVE) return

    const token = randomUUID()
    await this.prisma.adminPasswordResetToken.create({
      data: {
        adminId: admin.id,
        token,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL * 1000),
      },
    })

    this.emailService
      .sendMail({
        to: admin.email,
        subject: 'Reset your admin password',
        templatePath: join(TEMPLATES_DIR, 'reset-password.hbs'),
        context: {
          name: admin.email,
          link: `${process.env.ADMIN_APP_URL ?? 'http://localhost:3002'}/reset-password?token=${token}`,
        },
      })
      .catch(() => {})
  }

  async resetPassword(token: string, password: string) {
    const resetToken = await this.prisma.adminPasswordResetToken.findUnique({ where: { token } })

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token')
    }

    const passwordHash = await hashPassword(password)

    await this.prisma.$transaction([
      this.prisma.admin.update({
        where: { id: resetToken.adminId },
        data: { passwordHash },
      }),
      this.prisma.adminPasswordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ])
  }
}

function parseAdminSessionData(session: SessionData): AdminSessionData {
  const adminId = session.adminId
  const permissions = session.permissions
  const roles = session.roles
  if (
    typeof adminId !== 'string' ||
    !Array.isArray(roles) ||
    !roles.every((role) => typeof role === 'string') ||
    !Array.isArray(permissions) ||
    !permissions.every((permission) => typeof permission === 'string')
  ) {
    throw new UnauthorizedException('Session payload is invalid')
  }

  return {
    adminId,
    permissions,
    roles,
  }
}
