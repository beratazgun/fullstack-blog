import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PublishBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  blogCode: string;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsArray()
  @IsNotEmpty()
  tag: string[];

  @IsString()
  @IsNotEmpty()
  thumbnail: string;
}
