import { PrismaClient } from '@prisma/client';
import { GeneratorManager } from '@src/core/libs/GeneratorManager';
import Hashmanager from '@src/core/libs/HashManager';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function userSeed() {
  try {
    const usersData: any[] = [];

    const roleID = await prisma.roles.findFirst({
      where: {
        role: 'user',
      },
    });

    for (let index = 0; index < 20; index++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      usersData.push({
        id: faker.string.uuid(),
        userName: faker.internet.userName({
          firstName,
          lastName,
        }),
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        password: await Hashmanager.hashPassword('Usrw123!_'),
        roleID: roleID.id,
        userCode: GeneratorManager.generateRandomId({
          length: 12,
          type: 'number',
          prefix: 'USID',
        }),
        isAccountConfirmed: true,
        profileImage: faker.image.urlLoremFlickr({ category: 'profile' }),
        bio: faker.person.bio(),
      });
    }

    await prisma.users.createMany({
      data: [
        ...usersData,
        {
          userName: 'johndoe',
          firstName: 'john',
          lastName: 'doe',
          email: 'johndoe@gmail.com',
          password: await Hashmanager.hashPassword('Usrw123!_'),
          roleID: roleID.id,
          userCode: GeneratorManager.generateRandomId({
            length: 12,
            type: 'number',
            prefix: 'USID',
          }),
          isAccountConfirmed: true,
          bio: faker.person.bio(),
          profileImage: faker.image.urlLoremFlickr({ category: 'profile' }),
        },
      ],
    });

    await prisma.readingList.createMany({
      data: new Array(20).fill(0).map((_, index) => {
        const readingListCode = GeneratorManager.generateRandomId({
          length: 10,
          type: 'number',
          prefix: 'RLID',
        });
        return {
          readingListCode: readingListCode,
          readingListName: 'reading list',
          readingListNameSlug: `reading-list-${readingListCode}`,
          userID: usersData[index].id,
          isDeletable: false,
        };
      }),
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

export default userSeed;
