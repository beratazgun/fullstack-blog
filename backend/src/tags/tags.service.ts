import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { Response, NextFunction } from 'express';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * @method getTags
   * @param res | Response
   * @param next | NextFunction
   * @returns Promise<void>
   * @description Get all tags
   */
  async getTags(res: Response, next: NextFunction) {
    const tags = await this.prismaService.tags.findMany({
      select: {
        tag: true,
        beautifiedTag: true,
        tagSlug: true,
      },
    });

    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      status: 'success',
      payload: {
        length: tags.length,
        docs: tags,
      },
    });
  }
}
