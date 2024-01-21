import { Request } from 'express';
import { PrismaService } from '@src/prisma/prisma.service';
import { FilterDto } from '../dtos/Filter.dto';
import type { Blogs, Tags, Users, ReadingList } from '@prisma/client';
import { map, omit } from 'lodash';

interface IQueryOptions {
  page: string;
  limit: string;
  blogCode: string;
  tagSlug: string;
  userName: string;
  isPublished: boolean;
  isDeleted: boolean;
}

interface IPaginationFields {
  limit: number;
  skip: number;
  page: number;
  filteredLength: number;
  nextPage: number | null;
  prevPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ISignedInUserReadingList
  extends Pick<
    ReadingList,
    'readingListName' | 'readingListCode' | 'readingListNameSlug'
  > {
  blogCode: Blogs['blogCode'];
}

interface IDocs extends Partial<Blogs> {
  tags: Pick<Tags, 'tag' | 'tagSlug' | 'beautifiedTag'>[];
  writer: Pick<
    Users,
    'firstName' | 'lastName' | 'profileImage' | 'userCode' | 'userName'
  >;
  signedInUserReadingList: ISignedInUserReadingList[];
}

interface ILastVersionOfData {
  pagination: IPaginationFields;
  docs: IDocs[];
}

export class Filter {
  public lastVersionOfData: ILastVersionOfData = {
    pagination: undefined,
    docs: [],
  };

  constructor(
    public queries: FilterDto,
    public prisma: PrismaService,
    public req: Request,
  ) {}

  public async filterBlogs() {
    let signedInUserReadingList: ReadingList[] = [];
    const isUserSignedIn = !!this.req['user'];
    const { pagination } = await this.pagination();
    const whereCondition = this.whereConditionModifier();

    if (isUserSignedIn) {
      signedInUserReadingList = await this.prisma.readingList.findMany({
        where: {
          userID: this.req['user'].id,
        },
      });
    }

    const blogs = await this.prisma.blogs.findMany({
      where: whereCondition,
      include: {
        Tags: {
          select: {
            tag: true,
            tagSlug: true,
            beautifiedTag: true,
          },
        },
        Users: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
            userName: true,
            userCode: true,
          },
        },
        ReadingListToBlogs: {
          where: {
            readingListID: {
              in: signedInUserReadingList.map((readingList) => readingList.id),
            },
          },
          include: {
            ReadingList: {
              select: {
                readingListName: true,
                readingListCode: true,
                readingListNameSlug: true,
              },
            },
            Blogs: {
              select: {
                blogCode: true,
              },
            },
          },
        },
      },
      take: pagination.limit,
      skip: pagination.skip,
    });

    this.lastVersionOfData.pagination['filteredLength'] = blogs.length;
    this.lastVersionOfData.docs = map(blogs, (blog) => ({
      ...omit(blog, [
        'id',
        'userID',
        'language',
        'isDeleted',
        'deletedAt',
        'Tags',
        'updatedAt',
        'createdAt',
        'Users',
        'ReadingListToBlogs',
      ]),
      tags: blog.Tags.map((tag) => {
        return tag;
      }),
      writer: {
        firstName: blog.Users.firstName,
        lastName: blog.Users.lastName,
        profileImage: blog.Users.profileImage,
        userName: blog.Users.userName,
        userCode: blog.Users.userCode,
      },
      signedInUserReadingList: blog.ReadingListToBlogs.map((readingList) => {
        const { readingListName, readingListCode, readingListNameSlug } =
          readingList.ReadingList;
        return {
          readingListName,
          readingListCode,
          readingListNameSlug,
          blogCode: readingList.Blogs.blogCode,
        };
      }),
    }));

    return this.lastVersionOfData;
  }

  protected whereConditionModifier() {
    const whereCondition = {};
    const { blogCode, tagSlug, userName } = this.queries;

    for (const iterator of Object.keys(this.queries)) {
      if (iterator === 'tagSlug') {
        whereCondition['Tags'] = {
          some: {
            tagSlug,
          },
        };
      }

      if (iterator === 'userName') {
        whereCondition['Users'] = {
          userName,
        };
      }

      if (iterator === 'blogCode') {
        whereCondition['blogCode'] = blogCode;
      }

      if (iterator === 'isPublished') {
        whereCondition['isPublished'] = this.queries['isPublished'] === 'true';
      }

      if (iterator === 'isDeleted') {
        whereCondition['isDeleted'] = this.queries['isDeleted'] === 'true';
      }
    }

    return whereCondition;
  }

  protected async pagination(): Promise<ILastVersionOfData> {
    let paginationFields: IPaginationFields = {
      limit: 0,
      skip: 0,
      page: 0,
      filteredLength: 0,
      nextPage: 0,
      prevPage: 0,
      totalPages: 0,
      currentPage: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };

    const totalDocsLength = await this.prisma.blogs.count();
    const page = Math.ceil(Number(this.queries.page)) || 1;
    const limit = Math.ceil(Number(this.queries.limit)) || 100;
    const skip = (page - 1) * limit;

    paginationFields['skip'] = skip < totalDocsLength ? skip : totalDocsLength;
    paginationFields['page'] = page;
    paginationFields['limit'] = limit;
    paginationFields['totalPages'] = Math.ceil(totalDocsLength / limit);
    paginationFields['currentPage'] = page;
    paginationFields['hasNextPage'] = paginationFields['totalPages'] > page;
    paginationFields['hasPrevPage'] = page > 1;
    paginationFields['nextPage'] = paginationFields['hasNextPage']
      ? page + 1
      : null;
    paginationFields['prevPage'] = page === 1 ? 1 : page - 1;

    this.lastVersionOfData['pagination'] = paginationFields;

    return this.lastVersionOfData;
  }
}
