import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function tagsSeed() {
  try {
    await prisma.tags.createMany({
      data: [
        {
          tag: 'typescript',
          tagSlug: 'typescript',
          beautifiedTag: 'TypeScript',
        },
        {
          tag: 'redis',
          tagSlug: 'redis',
          beautifiedTag: 'Redis',
        },
        {
          tag: 'python',
          tagSlug: 'python',
          beautifiedTag: 'Python',
        },
        {
          tag: 'sveltekit',
          tagSlug: 'sveltekit',
          beautifiedTag: 'sveltekit',
        },
        {
          tag: 'javascript',
          tagSlug: 'javascript',
          beautifiedTag: 'JavaScript',
        },
        {
          tag: 'nodejs',
          tagSlug: 'nodejs',
          beautifiedTag: 'NodeJS',
        },
        {
          tag: 'programming',
          tagSlug: 'programming',
          beautifiedTag: 'Programming',
        },
        {
          tag: 'software development',
          tagSlug: 'software-development',
          beautifiedTag: 'Software Development',
        },
        {
          tag: 'css',
          tagSlug: 'css',
          beautifiedTag: 'CSS',
        },
        {
          tag: 'scss',
          tagSlug: 'scss',
          beautifiedTag: 'SCSS',
        },
        {
          tag: 'html',
          tagSlug: 'html',
          beautifiedTag: 'HTML',
        },
        {
          tag: 'react',
          tagSlug: 'react',
          beautifiedTag: 'React',
        },
        {
          tag: 'web development',
          tagSlug: 'web-development',
          beautifiedTag: 'Web Development',
        },
        {
          tag: 'aws',
          tagSlug: 'aws',
          beautifiedTag: 'AWS',
        },
        {
          tag: 'docker',
          tagSlug: 'docker',
          beautifiedTag: 'Docker',
        },
        {
          tag: 'java',
          tagSlug: 'java',
          beautifiedTag: 'Java',
        },
        {
          tag: 'c++',
          tagSlug: 'c++',
          beautifiedTag: 'C++',
        },
        {
          tag: 'swift',
          tagSlug: 'swift',
          beautifiedTag: 'Swift',
        },
        {
          tag: 'flutter',
          tagSlug: 'flutter',
          beautifiedTag: 'Flutter',
        },
        {
          tag: 'bun',
          tagSlug: 'bun',
          beautifiedTag: 'Bun',
        },
        {
          tag: 'dart',
          tagSlug: 'dart',
          beautifiedTag: 'Dart',
        },
        {
          tag: 'sql',
          tagSlug: 'sql',
          beautifiedTag: 'SQL',
        },
        {
          tag: 'system design',
          tagSlug: 'system-design',
          beautifiedTag: 'System Design',
        },
        {
          tag: 'design pattern',
          tagSlug: 'design-pattern',
          beautifiedTag: 'Design Pattern',
        },
        {
          tag: 'nestjs',
          tagSlug: 'nestjs',
          beautifiedTag: 'NestJS',
        },
        {
          tag: 'expressjs',
          tagSlug: 'expressjs',
          beautifiedTag: 'ExpressJS',
        },
        {
          tag: 'astro',
          tagSlug: 'astro',
          beautifiedTag: 'Astro',
        },
        {
          tag: 'tailwindcss',
          tagSlug: 'tailwindcss',
          beautifiedTag: 'TailwindCSS',
        },
        {
          tag: 'nextjs',
          tagSlug: 'nextjs',
          beautifiedTag: 'NextJS',
        },
        {
          tag: 'go',
          tagSlug: 'go',
          beautifiedTag: 'Go',
        },
        {
          tag: 'ruby',
          tagSlug: 'ruby',
          beautifiedTag: 'Ruby',
        },
        {
          tag: 'graphql',
          tagSlug: 'graphql',
          beautifiedTag: 'Graphql',
        },
        {
          tag: 'rest api',
          tagSlug: 'rest-api',
          beautifiedTag: 'RestAPI',
        },
        {
          tag: 'game development',
          tagSlug: 'game-development',
          beautifiedTag: 'Game Development',
        },
        {
          tag: 'angular',
          tagSlug: 'angular',
          beautifiedTag: 'Angular',
        },
        {
          tag: 'kubernetes',
          tagSlug: 'kubernetes',
          beautifiedTag: 'Kubernetes',
        },
        {
          tag: 'mongodb',
          tagSlug: 'mongodb',
          beautifiedTag: 'mongodb',
        },
        {
          tag: 'api security',
          tagSlug: 'api-security',
          beautifiedTag: 'Api Security',
        },
        {
          tag: 'android',
          tagSlug: 'Android',
          beautifiedTag: 'android',
        },
        {
          tag: 'ios',
          tagSlug: 'ios',
          beautifiedTag: 'İos',
        },
      ],
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

export default tagsSeed;
