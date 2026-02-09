import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Global Admin
  await prisma.user.upsert({
    where: { email: 'admin@system.com' },
    update: {},
    create: {
      username: 'globaladmin',
      email: 'admin@system.com',
      password: hashedPassword,
      role: Role.GLOBAL_ADMIN,
      isValidated: true,
    },
  });

  // Create Standard User
  await prisma.user.upsert({
    where: { email: 'user@system.com' },
    update: {},
    create: {
      username: 'standarduser',
      email: 'user@system.com',
      password: hashedPassword,
      role: Role.STANDARD_USER,
      isValidated: true,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
