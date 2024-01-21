import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateReadingListBodyDto } from './dtos/CreateReadingListBody.dto';
import { GeneratorManager } from '@src/core/libs/GeneratorManager';
import { PrismaService } from '@src/prisma/prisma.service';
import { AddBlogToReadingListBodyDto } from './dtos/AddBlogToReadingListBody.dto';
import { DeleteBlogToReadingListBodyDto } from './dtos/DeleteBlogToReadingListBody.dto';

import { map, omit } from 'lodash';

@Injectable()
export class ReadingListsService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Create a reading list
   * @param body CreateReadingListBodyDto
   * @param req Request
   * @param res Response
   */
  async createReadingList(
    body: CreateReadingListBodyDto,
    req: Request,
    res: Response,
  ) {
    const readingListCode = GeneratorManager.generateRandomId({
      length: 10,
      type: 'number',
      prefix: 'RLID',
    });

    await this.prismaService.readingList.create({
      data: {
        readingListCode: readingListCode,
        readingListName: body.readingListName,
        readingListNameSlug: `${body.readingListName
          .replace(/\s+/g, '-')
          .toLowerCase()}-${readingListCode}`,
        userID: req['user'].id,
        isDeletable: true,
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Reading list created successfully',
    });
  }

  /**
   * Add blog to reading list
   * @param body AddBlogToReadingListBodyDto
   * @param req Request
   * @param res Response
   */
  async addBlogToReadingList(body: AddBlogToReadingListBodyDto, res: Response) {
    const readingList = await this.prismaService.readingList.findUniqueOrThrow({
      where: {
        readingListCode: body.readingListCode,
      },
    });

    const findblog = await this.prismaService.blogs.findUniqueOrThrow({
      where: {
        blogCode: body.blogCode,
      },
    });

    const existingRecord =
      await this.prismaService.readingListToBlogs.findFirst({
        where: {
          readingListID: readingList.id,
          blogID: findblog.id,
        },
      });

    if (!existingRecord) {
      await this.prismaService.readingListToBlogs.create({
        data: {
          readingListID: readingList.id,
          blogID: findblog.id,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Blog added to reading list successfully',
    });
  }

  /**
   * Delete Blog In Reading List
   * @param body DeleteBlogToReadingListBodyDto
   * @param req Request
   * @param res Response
   */
  async deleteBlogInReadingList(
    body: DeleteBlogToReadingListBodyDto,
    res: Response,
  ) {
    const readingList = await this.prismaService.readingList.findUniqueOrThrow({
      where: {
        readingListCode: body.readingListCode,
      },
    });

    const findblog = await this.prismaService.blogs.findUniqueOrThrow({
      where: {
        blogCode: body.blogCode,
      },
    });

    const existingRecord =
      await this.prismaService.readingListToBlogs.findFirst({
        where: {
          readingListID: readingList.id,
          blogID: findblog.id,
        },
      });

    if (existingRecord) {
      await this.prismaService.readingListToBlogs.delete({
        where: {
          id: existingRecord.id,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Blog deleted from reading list successfully',
    });
  }

  /**
   * Get Reading Lists
   * @param req Request
   * @param res Response
   */
  async getReadingLists(req: Request, res: Response) {
    const readingLists = await this.prismaService.readingList.findMany({
      where: {
        userID: req['user'].id,
      },
      select: {
        readingListCode: true,
        readingListName: true,
        readingListNameSlug: true,
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      payload: readingLists,
    });
  }

  /**
   * Get Users Reading Lists
   * @param req Request
   * @param res Response
   * @returns
   */
  async getReadingListsDetail(req: Request, res: Response) {
    const userReadingLists = await this.prismaService.readingList.findMany({
      where: {
        userID: req['user'].id,
      },
      include: {
        ReadingListToBlogs: {
          include: {
            Blogs: {
              select: {
                thumbnail: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      payload: map(userReadingLists, (el) => ({
        ...omit(el, [
          'ReadingListToBlogs',
          'id',
          'userID',
          'createdAt',
          'updatedAt',
        ]),
        blogsLength: el.ReadingListToBlogs.length,
        blogsThumbnails: el.ReadingListToBlogs.map((el) => {
          return el.Blogs.thumbnail;
        }),
      })),
    });
  }

  /**
   * Get Blogs In Reading List
   * @param param string
   * @param req Request
   */
  async getBlogsInReadingList(readingListCode: string, res: Response) {
    const readingList = await this.prismaService.readingList.findUniqueOrThrow({
      where: {
        readingListCode,
      },
    });

    const blogsInReadingList =
      await this.prismaService.readingListToBlogs.findMany({
        where: {
          readingListID: readingList.id,
        },
        select: {
          Blogs: {
            select: {
              blogCode: true,
              title: true,
              titleSlug: true,
              description: true,
              content: true,
              thumbnail: true,
              viewCount: true,
              isPublished: true,
              publishedAt: true,
              Users: {
                select: {
                  firstName: true,
                  lastName: true,
                  userName: true,
                  userCode: true,
                  profileImage: true,
                },
              },
              BlogsToTags: {
                select: {
                  Tags: {
                    select: {
                      tag: true,
                      tagSlug: true,
                      beautifiedTag: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      payload: [
        ...blogsInReadingList.map((blog) => {
          return {
            ...omit(blog.Blogs, ['BlogsToTags', 'Users']),
            tags: [
              ...blog.Blogs.BlogsToTags.map((tag) => {
                return tag.Tags;
              }),
            ],
            writer: {
              firstName: blog.Blogs.Users.firstName,
              lastName: blog.Blogs.Users.lastName,
              profileImage: blog.Blogs.Users.profileImage,
              userName: blog.Blogs.Users.userName,
              userCode: blog.Blogs.Users.userCode,
            },
            signedInUserReadingList: [],
          };
        }),
      ],
    });
  }

  /**
   * Delete Reading List
   * @param readingListCode
   * @param res
   */
  async deleteReadingList(readingListCode: string, res: Response) {
    await this.prismaService.readingList.delete({
      where: {
        readingListCode,
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Reading list deleted',
    });
  }
}
