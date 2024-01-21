import { IsBoolean } from 'class-validator';

export class UpdateBlogStatusDto {
  @IsBoolean()
  isPublished: boolean;
}
