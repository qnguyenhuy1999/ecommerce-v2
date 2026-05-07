import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  // Seed storefront roles
  const roles = ['buyer', 'seller', 'admin'];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Seeded roles:', roles.join(', '));

  // Seed admin roles with permissions
  const adminRoles = [
    {
      name: 'SUPER_ADMIN' as const,
      description: 'Full system access',
      permissions: [
        'ADMIN_MANAGE',
        'ROLE_MANAGE',
        'SELLER_VIEW',
        'SELLER_APPROVE',
        'SELLER_SUSPEND',
        'PRODUCT_VIEW',
        'PRODUCT_MODERATE',
        'ORDER_VIEW',
        'ORDER_MANAGE',
        'MARKETING_MANAGE',
        'AUDIT_VIEW',
        'SETTINGS_MANAGE',
        'DASHBOARD_VIEW',
      ] as const,
    },
    {
      name: 'ADMIN' as const,
      description: 'Administrative access',
      permissions: [
        'SELLER_VIEW',
        'SELLER_APPROVE',
        'SELLER_SUSPEND',
        'PRODUCT_VIEW',
        'PRODUCT_MODERATE',
        'ORDER_VIEW',
        'ORDER_MANAGE',
        'AUDIT_VIEW',
        'DASHBOARD_VIEW',
      ] as const,
    },
    {
      name: 'MODERATOR' as const,
      description: 'Content moderation',
      permissions: [
        'SELLER_VIEW',
        'SELLER_APPROVE',
        'PRODUCT_VIEW',
        'PRODUCT_MODERATE',
        'DASHBOARD_VIEW',
      ] as const,
    },
    {
      name: 'SUPPORT' as const,
      description: 'Customer support',
      permissions: [
        'SELLER_VIEW',
        'ORDER_VIEW',
        'DASHBOARD_VIEW',
      ] as const,
    },
    {
      name: 'VIEWER' as const,
      description: 'Read-only access',
      permissions: [
        'SELLER_VIEW',
        'PRODUCT_VIEW',
        'ORDER_VIEW',
        'DASHBOARD_VIEW',
      ] as const,
    },
  ];

  for (const role of adminRoles) {
    const adminRole = await prisma.adminRole.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: {
        name: role.name,
        description: role.description,
      },
    });

    // Upsert permissions
    for (const permission of role.permissions) {
      await prisma.rolePermission.upsert({
        where: {
          adminRoleId_permission: {
            adminRoleId: adminRole.id,
            permission,
          },
        },
        update: {},
        create: {
          adminRoleId: adminRole.id,
          permission,
        },
      });
    }
  }
  console.log(
    'Seeded admin roles:',
    adminRoles.map((r) => r.name).join(', '),
  );

  // Seed a default super admin (password: admin123)
  // bcrypt hash for "admin123" with 12 rounds
  const defaultAdminEmail = 'admin@marketplace.com';
  const existing = await prisma.admin.findUnique({
    where: { email: defaultAdminEmail },
  });

  if (!existing) {
    const superAdminRole = await prisma.adminRole.findUnique({
      where: { name: 'SUPER_ADMIN' },
    });

    if (superAdminRole) {
      const admin = await prisma.admin.create({
        data: {
          id: randomUUID(),
          email: defaultAdminEmail,
          // "admin123" hashed with bcrypt (12 rounds)
          passwordHash:
            '$2b$12$LJ3m4ys3uz2RmVfGHpOHxOsJMtL2F7.UGHb2kQYpBLKJSp9oQOLCe',
          firstName: 'Super',
          lastName: 'Admin',
          status: 'ACTIVE',
        },
      });

      await prisma.adminRoleAssignment.create({
        data: {
          adminId: admin.id,
          adminRoleId: superAdminRole.id,
        },
      });

      console.log('Seeded default admin:', defaultAdminEmail);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
