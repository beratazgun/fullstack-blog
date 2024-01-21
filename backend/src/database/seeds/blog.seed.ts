import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { GeneratorManager } from '@src/core/libs/GeneratorManager';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function blogSeed() {
  try {
    const randomUsersIds = await prisma.users.findMany();
    let content = '';
    for (let i = 0; i < 37; i++) {
      const fakeTitle = faker.lorem.sentence();
      const fakeBlogCode = GeneratorManager.generateRandomId({
        length: 12,
        type: 'number',
      });
      const allTags = await prisma.tags.findMany();

      for (let index = 0; index < 4; index++) {
        content += '<p>' + faker.lorem.paragraphs(2) + '</p>';
      }

      const tagIDs = await prisma.tags.findMany({
        where: {
          tag: {
            in: [
              allTags[Math.floor(Math.random() * allTags.length)].tag,
              allTags[Math.floor(Math.random() * allTags.length)].tag,
              allTags[Math.floor(Math.random() * allTags.length)].tag,
            ],
          },
        },
      });

      // Create a new blog entry
      const blog = await prisma.blogs.create({
        data: {
          title: fakeTitle,
          blogCode: fakeBlogCode,
          titleSlug:
            slugify(fakeTitle, {
              replacement: '-',
              lower: true,
            }) +
            '-' +
            fakeBlogCode,
          publishedAt: faker.date.past(),
          content: '<div>' + content + '</div>',
          description: faker.lorem.words(120),
          thumbnail: faker.image.urlPicsumPhotos({
            width: 1920,
            height: 1080,
          }),
          userID:
            randomUsersIds[Math.floor(Math.random() * randomUsersIds.length)]
              .id,
          isPublished: true,
          Tags: {
            connect: tagIDs.map((tag) => ({ id: tag.id })),
          },
        },
      });

      // Create associations with tags
      await prisma.blogsToTags.createMany({
        data: tagIDs.map((tag) => ({
          blogID: blog.id,
          tagID: tag.id,
        })),
      });

      // Update user's blog count
      await prisma.users.update({
        where: {
          id: blog.userID,
        },
        data: {
          blogCount: {
            increment: 1,
          },
        },
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

export default blogSeed;
