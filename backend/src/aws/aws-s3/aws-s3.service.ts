import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  S3Client,
  ListBucketsCommand,
  ListBucketsCommandOutput,
  PutObjectCommand,
  __Client,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import { GeneratorManager } from '@src/core/libs/GeneratorManager';
import { ConfigService } from '@nestjs/config';
import { isEmpty } from 'lodash';
import { NextFunction } from 'express';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      endpoint:
        process.env.NODE_ENV === 'development'
          ? process.env.AWS_S3_URL.replace('localhost', 'localstack')
          : undefined,
      forcePathStyle: process.env.NODE_ENV === 'development' ? true : false,
    });
  }

  /**
   * @method listBuckets
   * @description List all buckets in s3 bucket.
   */
  private async listBuckets(): Promise<ListBucketsCommandOutput> {
    const command = new ListBucketsCommand({});
    return await this.s3Client.send(command);
  }

  /**
   * @method uploadImage
   * @param ımageName
   * @description This will upload image to s3 bucket. İf image upload is successfull, it will return the image data. Otherwise, it will throw an error.
   */
  async uploadImage(file: Express.Multer.File, next: NextFunction) {
    const fileStream = fs.createReadStream(
      `${this.configService.get<string>('UPLOAD_PATH')}/${file.originalname}`,
    );

    const bucket = await this.listBuckets();

    if (isEmpty(bucket.Buckets)) {
      return next(new BadRequestException('Something went wrong.'));
    }

    const uploadCommand = new PutObjectCommand({
      Bucket: bucket.Buckets[0].Name,
      Key:
        'images/' +
        GeneratorManager.generateRandomId({
          length: 48,
          type: 'textAndNumber',
        }) +
        file.mimetype.replace('image/', '.'),
      Body: fileStream,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(uploadCommand);

      fs.unlinkSync(
        `${this.configService.get<string>('UPLOAD_PATH')}/${file.originalname}`,
      );

      return {
        location: `${process.env.AWS_S3_URL}/blog-aws/${uploadCommand.input.Key}`,
      };
    } catch (error) {
      throw new Error('File upload failed');
    }
  }

  /**
   * @method deleteImageOnS3
   * @param imageUrl
   * @description This will delete image from s3 bucket. İf image delete is successfull, it will return the image data. Otherwise, it will throw an error.
   */
  async deleteImageFromS3(imageUrl: string, next: NextFunction) {
    if (!imageUrl.includes(process.env.AWS_S3_URL)) {
      return next(
        new BadRequestException('Image url is not valid. Please try again.'),
      );
    }

    const headObject = new HeadObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: imageUrl.replace(`${process.env.AWS_S3_URL}/blog-aws/`, ''),
    });

    try {
      // This will check if image exists on s3 bucket.
      await this.s3Client.send(headObject);

      const deleteObject = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imageUrl.replace(`${process.env.AWS_S3_URL}/blog-aws/`, ''),
      });

      // This will delete image from s3 bucket.
      await this.s3Client.send(deleteObject);
    } catch (error) {
      if (error.name === 'NotFound') {
        return next(new NotFoundException('Image not found.'));
      } else {
        return next(
          new BadRequestException('Image url is not valid. Please try again.'),
        );
      }
    }
  }
}
