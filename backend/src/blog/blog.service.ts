import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FilterDto, PublishBlogDto, UpdateBlogStatusDto } from './dtos/dtos';
import { GeneratorManager } from '@src/core/libs/GeneratorManager';
import { PrismaService } from '@src/prisma/prisma.service';
import slugify from 'slugify';
import { omit, pick } from 'lodash';
import { PrismaClient } from '@prisma/client';
import { Filter } from './helpers/Filter';

@Injectable()
export class BlogService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   *
   * @method startNewBlog
   * @param req
   * @param res
   * @returns Promise<void>
   * @description Start a new blog. Before publishing a blog, we need to create a blog first.
   */
  async NewBlog(req: Request, res: Response): Promise<void> {
    const blogCode = GeneratorManager.generateRandomId({
      length: 12,
      type: 'number',
    });
    const blog = await this.prismaService.blogs.create({
      data: {
        blogCode,
        userID: req['user'].id as string,
        isPublished: false,
      },
      include: {
        Users: {
          select: {
            userCode: true,
          },
        },
      },
    });

    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      status: 'success',
      payload: {
        blogCode: blog.blogCode,
        userCode: blog.Users.userCode,
      },
    });
  }

  /**
   *
   * @method publishBlog
   * @param body
   * @param req
   * @param res
   * @returns Promise<void>
   * @description Create a new blog
   */
  async publishBlog(
    body: PublishBlogDto,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.prismaService.$transaction(async (prisma: PrismaClient) => {
      const tagIDs = await prisma.tags.findMany({
        where: {
          tag: {
            in: body.tag,
          },
        },
      });

      const findBlog = await prisma.blogs.findUnique({
        where: {
          blogCode: body.blogCode,
        },
      });

      if (!findBlog) {
        return next(new NotFoundException('Blog not found'));
      } else {
        const blog = await prisma.blogs.update({
          where: {
            blogCode: body.blogCode,
          },
          data: {
            ...omit(body, ['tag', 'images']),
            titleSlug:
              slugify(body.title, {
                replacement: '-',
                lower: true,
              }) +
              '-' +
              body.blogCode,
            publishedAt: new Date(),
            userID: req['user'].id as string,
            isPublished: true,
            Tags: {
              connect: tagIDs.map((tag) => ({ id: tag.id })),
            },
          },
        });

        await prisma.blogsToTags.createMany({
          data: tagIDs.map((tag) => ({
            blogID: blog.id,
            tagID: tag.id,
          })),
        });

        await prisma.users.update({
          where: {
            id: req['user'].id as string,
          },
          data: {
            blogCount: {
              increment: 1,
            },
          },
        });

        await prisma.images.createMany({
          data: body.images.map((image) => ({
            blogID: blog.id,
            image: image,
            imageCode: GeneratorManager.generateRandomId({
              length: 12,
              type: 'textAndNumber',
              prefix: 'IMID',
            }),
          })),
        });
      }
    });

    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      status: 'success',
      message: 'Blog created successfully',
    });
  }

  /**
   *
   * @method deleteBlog
   * @param blogCode | string
   * @param res | Response
   * @param next | NextFunction
   * @returns Promise<void>
   * @description Delete a blog
   */
  async deleteBlog(
    blogCode: string,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const blog = await this.prismaService.blogs.findFirst({
      where: {
        blogCode,
      },
    });

    if (!blog) {
      return next(new NotFoundException('Blog not found'));
    }

    if (blog.userID !== req['user'].id && req['user'].role !== 'user') {
      return next(new BadRequestException('You are not authorized'));
    }

    if (blog.isDeleted) {
      return next(new NotFoundException('Blog is already deleted'));
    }

    if (blog.content === null && blog.title === null) {
      await this.prismaService.blogs.delete({
        where: {
          blogCode,
        },
      });
    } else {
      await this.prismaService.blogs.update({
        where: {
          id: blog.id,
        },
        data: {
          isDeleted: true,
          isPublished: false,
        },
      });
    }

    await this.prismaService.users.update({
      where: {
        id: blog.userID,
      },
      data: {
        blogCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      status: 'success',
      message: 'Blog deleted successfully',
    });
  }

  /**
   *
   * @method updateBlogStatus
   * @param blogCode | string
   * @param body | UpdateBlogStatusDto
   * @param req | Request
   * @param res | Response
   * @param next | NextFunction
   * @returns Promise<void>
   * @description Update blog status
   */
  async updateBlogStatus(
    blogCode: string,
    body: UpdateBlogStatusDto,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const blog = await this.prismaService.blogs.findFirst({
      where: {
        blogCode,
      },
    });

    if (!blog) {
      return next(new NotFoundException('Blog not found'));
    }

    if (blog.userID !== req['user'].id) {
      return next(new BadRequestException('You are not authorized.'));
    }

    if (blog.isPublished === body.isPublished) {
      return next(
        new BadRequestException(
          `Blog is already ${body.isPublished ? 'published' : 'unpublished'}`,
        ),
      );
    }

    await this.prismaService.blogs.update({
      where: {
        id: blog.id,
      },
      data: {
        isPublished: body.isPublished,
      },
    });

    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      status: 'success',
      message: `Blog has ${
        body.isPublished ? 'published' : 'unpublished'
      } successfully`,
    });
  }

  /**
   *
   * @method updateBlogViewCount
   * @param blogCode | string
   * @param res | Response
   * @param next | NextFunction
   * @returns Promise<void>
   * @description Update blog view count
   */
  async updateBlogViewCount(
    blogCode: string,
    res: Response,
    next: NextFunction,
  ) {
    const blog = await this.prismaService.blogs.findFirst({
      where: {
        blogCode,
      },
    });

    if (!blog) {
      return next(new NotFoundException('Blog not found'));
    }

    await this.prismaService.blogs.update({
      where: {
        blogCode,
      },
      data: {
        viewCount: blog.viewCount + 1,
      },
    });

    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      status: 'success',
      message: `Blog view count has updated successfully`,
    });
  }

  /**
   * @method getAllBlogs
   * @param query | FilterDto
   * @param req | Request
   * @param res | Response
   * @returns Promise<void>
   * @description Get all blogs
   */
  async getAllBlogs(query: FilterDto, req: Request, res: Response) {
    const filter = new Filter(query, this.prismaService, req);
    const resultBlogs = await filter.filterBlogs();

    res.status(200).json({
      statusCode: res.statusCode,
      isSuccess: true,
      status: 'success',
      payload: resultBlogs,
    });
  }
}
