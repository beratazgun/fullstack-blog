import {
  Body,
  Controller,
  Get,
  Next,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Request, Response, NextFunction, query } from 'express';
import { AuthGuard } from '@src/core/guards/Auth.guard';
import { FilterDto, PublishBlogDto, UpdateBlogStatusDto } from './dtos/dtos';
import { IsUserGuard } from '@src/core/guards/IsUser.guard';
import { ApiTags } from '@nestjs/swagger';
import { IsUserSignedInGuard } from '@src/core/guards/IsUserSignedIn.guard';

@ApiTags('Blogs')
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  /**
   * @method NewBlog
   */
  @Post('/new')
  @UseGuards(AuthGuard, IsUserGuard)
  NewBlog(@Req() req: Request, @Res() res: Response) {
    return this.blogService.NewBlog(req, res);
  }

  /**
   * @method publishBlog
   */
  @Post('/publish')
  @UseGuards(AuthGuard, IsUserGuard)
  publishBlog(
    @Body() body: PublishBlogDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.blogService.publishBlog(body, req, res, next);
  }

  /**
   * @method deleteBlog
   */
  @Post('/delete/:blogCode')
  @UseGuards(AuthGuard, IsUserGuard)
  deleteBlog(
    @Param('blogCode') blogCode: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.blogService.deleteBlog(blogCode, req, res, next);
  }

  /**
   * @method updateBlogStatus
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/update/status/:blogCode')
  updateBlogStatus(
    @Param('blogCode') blogCode: string,
    @Body() body: UpdateBlogStatusDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.blogService.updateBlogStatus(blogCode, body, req, res, next);
  }

  /**
   * @method updateBlogViewCount
   */
  @Post('/update/view-count/:blogCode')
  updateBlogViewCount(
    @Param('blogCode') blogCode: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.blogService.updateBlogViewCount(blogCode, res, next);
  }

  /**
   * @method getAllBlogs
   */
  @UseGuards(IsUserSignedInGuard)
  @Get('/get/all')
  getAllBlogs(
    @Query() query: FilterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.blogService.getAllBlogs(query, req, res);
  }
}
