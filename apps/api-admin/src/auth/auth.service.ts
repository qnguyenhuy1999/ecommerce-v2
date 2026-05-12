import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import * as bcrypt from 'bcrypt'
import type { PrismaService } from '@ecom/database'
import type { SessionData, SessionService } from '@ecom/auth'
import { SESSION_SERVICE } from './session.provider'
import type { AdminSessionData } from './decorators/current-admin.decorator'

const SESSION_EXPIRY_DAYS = 7
const ACTIVE_STATUS = 'ACTIVE'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SESSION_SERVICE)
    private readonly sessionService: SessionService,
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

    if (admin.status !== ACTIVE_STATUS) {
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
      },
    })

    if (!admin || admin.status !== ACTIVE_STATUS) {
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
}

function parseAdminSessionData(session: SessionData): AdminSessionData {
  const adminId = session.adminId
  const permissions = session.permissions
  if (
    typeof adminId !== 'string' ||
    !Array.isArray(permissions) ||
    !permissions.every((permission) => typeof permission === 'string')
  ) {
    throw new UnauthorizedException('Session payload is invalid')
  }

  return {
    adminId,
    permissions,
    roles: session.roles,
  }
}
