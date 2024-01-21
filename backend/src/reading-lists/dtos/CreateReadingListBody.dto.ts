import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReadingListBodyDto {
  @IsNotEmpty()
  @IsString()
  readingListName: string;
}
