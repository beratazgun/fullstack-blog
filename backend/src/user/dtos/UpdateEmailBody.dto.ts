import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateEmailBodyDTo {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
