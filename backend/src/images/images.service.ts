import { BadRequestException, Injectable, Post } from '@nestjs/common';
import { AwsS3Service } from '@src/aws/aws-s3/aws-s3.service';
import { Request, Response, NextFunction } from 'express';
import { DeleteImageDto } from './dtos/DeleteImage.dto';

@Injectable()
export class ImagesService {
  constructor(private awsS3Service: AwsS3Service) {}

  /**
   * @method uploadImageToS3
   * @param req | Request
   * @param res | Response
   * @returns Promise<void>
   * @description Upload image to S3
   */
  async uploadImageToS3(
    file: Express.Multer.File,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const metadata = await this.awsS3Service.uploadImage(file, next);

    if (!metadata) {
      return;
    }

    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      status: 'success',
      message: 'Image uploaded successfully',
      payload: {
        imageUrl: metadata.location,
      },
    });
  }

  /**
   * @method deleteImageFromS3
   * @param req | Request
   * @param res | Response
   * @param next | NextFunction
   * @returns Promise<void>
   * @description Delete image from S3
   */
  async deleteImageFromS3(
    body: DeleteImageDto,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    body.imageUrls.forEach(async (imageUrl) => {
      await this.awsS3Service.deleteImageFromS3(imageUrl, next);
    });

    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      status: 'success',
      message: 'Image deleted successfully',
    });
  }
}
