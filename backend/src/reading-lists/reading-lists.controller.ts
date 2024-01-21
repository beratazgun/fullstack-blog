import {
  Body,
  Controller,
  Get,
  Next,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReadingListsService } from './reading-lists.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';
import { CreateReadingListBodyDto } from './dtos/CreateReadingListBody.dto';
import { AuthGuard } from '@src/core/guards/Auth.guard';
import { IsUserGuard } from '@src/core/guards/IsUser.guard';
import { AddBlogToReadingListBodyDto } from './dtos/AddBlogToReadingListBody.dto';
import { DeleteBlogToReadingListBodyDto } from './dtos/DeleteBlogToReadingListBody.dto';

@ApiTags('ReadingLists')
@Controller('reading-lists')
export class ReadingListsController {
  constructor(private readonly readingListsService: ReadingListsService) {}

  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/create')
  createReadingList(
    @Body() body: CreateReadingListBodyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.readingListsService.createReadingList(body, req, res);
  }

  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/add')
  addBlogToReadingList(
    @Body() body: AddBlogToReadingListBodyDto,
    @Res() res: Response,
  ) {
    return this.readingListsService.addBlogToReadingList(body, res);
  }

  @UseGuards(AuthGuard, IsUserGuard)
  @Get('/get/bilist/:readingListCode')
  getBlogsInReadingList(
    @Param('readingListCode') readingListCode: string,
    @Res() res: Response,
  ) {
    return this.readingListsService.getBlogsInReadingList(readingListCode, res);
  }

  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/delete')
  deleteBlogInReadingList(
    @Body() body: DeleteBlogToReadingListBodyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.readingListsService.deleteBlogInReadingList(body, res);
  }

  @UseGuards(AuthGuard, IsUserGuard)
  @Get('/get/lists/detail')
  getReadingListsDetail(@Req() req: Request, @Res() res: Response) {
    return this.readingListsService.getReadingListsDetail(req, res);
  }

  @UseGuards(AuthGuard, IsUserGuard)
  @Get('/get/lists')
  getReadingLists(@Req() req: Request, @Res() res: Response) {
    return this.readingListsService.getReadingLists(req, res);
  }

  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/delete/:readingListCode')
  deleteReadingList(
    @Param('readingListCode') readingListCode: string,
    @Res() res: Response,
  ) {
    return this.readingListsService.deleteReadingList(readingListCode, res);
  }
}
