const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const roles = await prisma.roles.findMany();
  console.log('Roles existentes:');
  roles.forEach(r => console.log(`- ${r.name} (Code: ${r.code})`));
  
  const admin = await prisma.users.findUnique({
    where: { email: 'admin@tienda-jb.local' },
    include: { user_roles: { include: { roles: true } } }
  });
  
  if (admin) {
    console.log(`\nRoles del usuario ${admin.email}:`);
    admin.user_roles.forEach(ur => console.log(`- ${ur.roles.name} (Code: ${ur.roles.code})`));
  }

  // Ensure they have 'jefe' role (the highest)
  const jefe = roles.find(r => r.code === 'jefe');
  if (jefe && admin) {
      await prisma.user_roles.upsert({
          where: { user_id_role_id: { user_id: admin.id, role_id: jefe.id } },
          update: {},
          create: { user_id: admin.id, role_id: jefe.id }
      });
      console.log(`\nRol 'jefe' asegurado para ${admin.email}`);
  }
  
  await prisma.$disconnect();
}
run();
