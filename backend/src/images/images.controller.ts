import {
  Body,
  Controller,
  Next,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageManager } from '@src/core/libs/upload/UploadImageManager';
import { ImageSizeReducerPipe } from '@src/core/pipes/ImageSizeReducer.pipe';
import { Request, Response, NextFunction } from 'express';
import { IsUserGuard } from '@src/core/guards/IsUser.guard';
import { AuthGuard } from '@src/core/guards/Auth.guard';
import { ImagesService } from './images.service';
import { DeleteImageDto } from './dtos/DeleteImage.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private imageService: ImagesService) {}

  /**
   * @method uploadBlogImage
   */
  @Post('/upload')
  @UseGuards(AuthGuard, IsUserGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: UploadImageManager.multerStorage(
        (req: Request, file: Express.Multer.File) => {
          return `${file.originalname}`;
        },
      ),
    }),
  )
  uploadImageToS3(
    @UploadedFile(ImageSizeReducerPipe) file: Express.Multer.File,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.imageService.uploadImageToS3(file, res, next);
  }

  /**
   * @method deleteBlogImage
   */
  @Post('/delete')
  @UseGuards(AuthGuard, IsUserGuard)
  deleteImageFromS3(
    @Body() body: DeleteImageDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.imageService.deleteImageFromS3(body, res, next);
  }
}
