import { IsNotEmpty, IsString } from 'class-validator';

export class AddBlogToReadingListBodyDto {
  @IsString()
  @IsNotEmpty()
  blogCode: string;

  @IsString()
  @IsNotEmpty()
  readingListCode: string;
}
