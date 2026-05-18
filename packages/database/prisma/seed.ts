import { loadDatabaseEnv } from '../env'

loadDatabaseEnv()

const { prisma } = await import('../src/client')

// bcrypt hash for "admin123" with 12 rounds — replace before production
const ADMIN_PASSWORD_HASH = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.4GUkqWn8WqWqWq'

async function main() {
  // Seed platform roles
  const roles = [
    { name: 'BUYER', description: 'Platform buyer' },
    { name: 'SELLER', description: 'Platform seller' },
    { name: 'SUPER_ADMIN', description: 'Full system access' },
  ]
  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: { name: r.name },
    })
  }
  console.log('Seeded roles:', roles.map((r) => r.name).join(', '))

  // Seed super admin user
  const adminEmail = 'admin@marketplace.com'
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (!existingAdmin) {
    const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } })
    if (!superAdminRole) throw new Error('SUPER_ADMIN role not found')

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: ADMIN_PASSWORD_HASH,
        firstName: 'Super',
        lastName: 'Admin',
        emailVerified: true,
        status: 'ACTIVE',
      },
    })

    await prisma.userRole.create({
      data: {
        userId: admin.id,
        roleId: superAdminRole.id,
      },
    })

    console.log('Seeded super admin:', adminEmail, '(password: admin123)')
  } else {
    console.log('Super admin already exists:', adminEmail)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
