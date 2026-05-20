import { hashPassword } from '@ecom/auth'
import { loadDatabaseEnv } from '../env'

loadDatabaseEnv()

const { prisma } = await import('../src/client')

const ADMIN_PASSWORD = 'admin123'
const ADMIN_PASSWORD_HASH = await hashPassword(ADMIN_PASSWORD)

const adminRoles = [
  { name: 'SUPER_ADMIN', description: 'Full system access' },
  { name: 'ADMIN', description: 'Platform administrator' },
  { name: 'MODERATOR', description: 'Moderates platform content and activity' },
  { name: 'SUPPORT', description: 'Handles support operations' },
  { name: 'VIEWER', description: 'Read-only admin access' },
] as const

const superAdminPermissions = [
  'ADMIN_MANAGE',
  'ROLE_MANAGE',
  'SELLER_VIEW',
  'SELLER_APPROVE',
  'SELLER_SUSPEND',
  'PRODUCT_VIEW',
  'PRODUCT_MODERATE',
  'ORDER_VIEW',
  'ORDER_MANAGE',
  'REFUND_VIEW',
  'REFUND_MANAGE',
  'USER_VIEW',
  'USER_MANAGE',
  'MARKETING_MANAGE',
  'BANNER_MANAGE',
  'NOTIFICATION_MANAGE',
  'REVIEW_MODERATE',
  'CATEGORY_MANAGE',
  'AUDIT_VIEW',
  'SETTINGS_MANAGE',
  'DASHBOARD_VIEW',
] as const

async function main() {
  for (const role of adminRoles) {
    await prisma.adminRole.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: {
        name: role.name,
        description: role.description,
      },
    })
  }
  console.log('Seeded admin roles:', adminRoles.map((role) => role.name).join(', '))

  const superAdminRole = await prisma.adminRole.findUnique({ where: { name: 'SUPER_ADMIN' } })
  if (!superAdminRole) throw new Error('SUPER_ADMIN admin role not found')

  for (const permission of superAdminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        adminRoleId_permission: {
          adminRoleId: superAdminRole.id,
          permission,
        },
      },
      update: {},
      create: {
        adminRoleId: superAdminRole.id,
        permission,
      },
    })
  }
  console.log('Seeded SUPER_ADMIN permissions:', superAdminPermissions.join(', '))

  const adminEmail = 'admin@marketplace.com'
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      firstName: 'Super',
      lastName: 'Admin',
      status: 'ACTIVE',
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      passwordHash: ADMIN_PASSWORD_HASH,
      firstName: 'Super',
      lastName: 'Admin',
      status: 'ACTIVE',
      emailVerified: true,
    },
  })

  await prisma.adminRoleAssignment.upsert({
    where: {
      adminId_adminRoleId: {
        adminId: admin.id,
        adminRoleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      adminId: admin.id,
      adminRoleId: superAdminRole.id,
    },
  })

  console.log('Seeded super admin account:', adminEmail, '(password: admin123)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
