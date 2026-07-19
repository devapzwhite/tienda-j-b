/**
 * Seed script: creates the default roles, permissions, and an admin user.
 *
 * Run: npx ts-node --esm src/prisma/seed.ts
 * (from apps/api directory with DATABASE_URL set)
 *
 * This uses the schema from packages/database via the shared Prisma client.
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ROLES = [
  { name: 'jefe', description: 'Acceso total al sistema' },
  {
    name: 'administrador',
    description: 'Gestión de productos, inventario y pedidos',
  },
  { name: 'cajero', description: 'Ventas directas y pedidos en tienda' },
] as const;

const PERMISSIONS = [
  'user.create',
  'user.read',
  'user.update',
  'user.delete',
  'role.manage',
  'product.create',
  'product.read',
  'product.update',
  'product.delete',
  'price.update',
  'inventory.read',
  'inventory.transfer',
  'inventory.transfer.approve',
  'inventory.adjustment',
  'sale.create',
  'sale.read',
  'sale.cancel',
  'order.create',
  'order.read',
  'order.update',
  'order.cancel',
  'report.read',
] as const;

// Permissions granted to each role
const ROLE_PERMISSIONS: Record<string, string[]> = {
  jefe: [...PERMISSIONS],
  administrador: [
    'product.create',
    'product.read',
    'product.update',
    'price.update',
    'inventory.read',
    'inventory.transfer',
    'inventory.transfer.approve',
    'inventory.adjustment',
    'order.create',
    'order.read',
    'order.update',
    'order.cancel',
    'sale.read',
  ],
  cajero: [
    'product.read',
    'inventory.read',
    'sale.create',
    'sale.read',
    'order.create',
    'order.read',
  ],
};

async function seedPermissions() {
  console.log('  → Seeding permissions...');
  for (const action of PERMISSIONS) {
    await prisma.permissions.upsert({
      where: { code: action },
      update: {},
      create: { code: action, name: action },
    });
  }
}

async function seedRoles() {
  console.log('  → Seeding roles...');
  for (const role of ROLES) {
    await prisma.roles.upsert({
      where: { code: role.name },
      update: { name: role.name },
      create: { code: role.name, name: role.name },
    });
  }
}

async function seedRolePermissions() {
  console.log('  → Linking role permissions...');
  for (const [roleName, permissionActions] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.roles.findUniqueOrThrow({ where: { code: roleName } });

    for (const action of permissionActions) {
      const permission = await prisma.permissions.findUniqueOrThrow({
        where: { code: action },
      });

      await prisma.role_permissions.upsert({
        where: {
          role_id_permission_id: {
            role_id: role.id,
            permission_id: permission.id,
          },
        },
        update: {},
        create: { role_id: role.id, permission_id: permission.id },
      });
    }
  }
}

async function seedAdminUser() {
  console.log('  → Seeding admin user...');
  const password_hash = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.users.upsert({
    where: { email: 'admin@tienda.com' },
    update: {},
    create: {
      email: 'admin@tienda.com',
      password_hash,
      full_name: 'Administrador Principal',
    },
  });

  const jefeRole = await prisma.roles.findUniqueOrThrow({
    where: { code: 'jefe' },
  });

  await prisma.user_roles.upsert({
    where: { user_id_role_id: { user_id: admin.id, role_id: jefeRole.id } },
    update: {},
    create: { user_id: admin.id, role_id: jefeRole.id },
  });

  console.log(`  ✓ Admin user: admin@tienda.com / Admin123!`);
}

async function seedStoreUsers() {
  console.log('  → Seeding store users...');
  const milePassword = await bcrypt.hash('mileee1223@', 10);
  const hooverPassword = await bcrypt.hash('hoover1223@', 10);
  
  const adminRole = await prisma.roles.findUniqueOrThrow({
    where: { code: 'administrador' },
  });

  // Milenka
  const mile = await prisma.users.upsert({
    where: { email: 'milenkasinka38@gmail.com' },
    update: {},
    create: {
      email: 'milenkasinka38@gmail.com',
      password_hash: milePassword,
      full_name: 'Milenka Sinka',
    },
  });

  await prisma.user_roles.upsert({
    where: { user_id_role_id: { user_id: mile.id, role_id: adminRole.id } },
    update: {},
    create: { user_id: mile.id, role_id: adminRole.id },
  });

  // Hoover
  const hoover = await prisma.users.upsert({
    where: { email: 'hoover.apaza@gmail.com' },
    update: {},
    create: {
      email: 'hoover.apaza@gmail.com',
      password_hash: hooverPassword,
      full_name: 'Hoover Apaza',
    },
  });

  await prisma.user_roles.upsert({
    where: { user_id_role_id: { user_id: hoover.id, role_id: adminRole.id } },
    update: {},
    create: { user_id: hoover.id, role_id: adminRole.id },
  });

  console.log(`  ✓ Store users seeded`);
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  await seedPermissions();
  await seedRoles();
  await seedRolePermissions();
  await seedAdminUser();
  await seedStoreUsers();

  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
