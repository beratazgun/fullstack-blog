import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageSizeReducerPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isImageFormatSupported(value)) {
      fs.unlinkSync(value.path);
      throw new BadRequestException('Invalid image format.');
    }

    if (!value || !this.isImage(value)) {
      throw new BadRequestException('Please upload an image file.');
    }

    if (value.size > 1024 * 1024 * 3) {
      throw new BadRequestException('Please upload an image less than 5MB.');
    }

    switch (value.mimetype.split('/')[1]) {
      case 'png':
        this.editPngImage(value);
        break;
      case 'jpeg':
        this.editJpgImage(value);
        break;
      case 'webp':
        this.editWebpImage(value);
        break;
    }

    return value;
  }

  async editPngImage(value: any) {
    await sharp(value.path)
      .png({ quality: 50, compressionLevel: 8 })
      .toBuffer()
      .then((data) => {
        this.saveImage(value, data);
      });

    return value;
  }

  async editJpgImage(value: any) {
    await sharp(value.path)
      .jpeg({ quality: 50, progressive: true })
      .toBuffer()
      .then((data) => {
        this.saveImage(value, data);
      });

    return value;
  }

  async editWebpImage(value: any) {
    await sharp(value.path)
      .webp({ quality: 60 })
      .toBuffer()
      .then((data) => {
        this.saveImage(value, data);
      });

    return value;
  }

  protected isImage(file: any) {
    const mimeType = file.mimetype.split('/')[0];
    return mimeType === 'image';
  }

  protected saveImage(file: any, resizedImage: Buffer) {
    const filePath = `${this.configService.get<string>('UPLOAD_PATH')}/${
      file.originalname
    }`;

    if (file.size > resizedImage.buffer.byteLength) {
      fs.writeFileSync(filePath, resizedImage);
    }
  }

  protected isImageFormatSupported(file: any) {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    return allowedMimes.includes(file.mimetype);
  }
}
