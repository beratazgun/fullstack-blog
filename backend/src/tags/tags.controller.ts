import { Controller } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Res, Get, Next } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  /**
   * @method GetTags
   */
  @Get('/get/all')
  getTags(@Res() res: Response, @Next() next: NextFunction) {
    return this.tagsService.getTags(res, next);
  }
}
