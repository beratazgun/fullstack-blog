import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteImageDto {
  @IsArray()
  @IsNotEmpty()
  imageUrls: string[];
}
