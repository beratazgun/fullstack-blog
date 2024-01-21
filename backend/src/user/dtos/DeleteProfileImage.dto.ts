import { IsEmpty, IsString } from 'class-validator';

export class DeleteProfileImageDto {
  @IsString({
    message: 'Image url must be a string.',
  })
  imageUrl: string;
}
