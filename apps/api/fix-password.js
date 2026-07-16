const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function run() {
  const hash = await bcrypt.hash('admin123', 10);
  const user = await prisma.users.findUnique({ where: { email: 'admin@tienda-jb.local' } });
  if (!user) {
    console.log("User not found!");
  } else {
    await prisma.users.update({
      where: { email: 'admin@tienda-jb.local' },
      data: { password_hash: hash }
    });
    console.log('Password updated successfully.');
  }
  await prisma.$disconnect();
}
run();
