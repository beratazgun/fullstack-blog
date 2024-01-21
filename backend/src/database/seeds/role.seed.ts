import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function roleSeed() {
  try {
    await prisma.roles.createMany({
      data: [
        {
          role: 'admin',
        },
        {
          role: 'user',
        },
      ],
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

export default roleSeed;
