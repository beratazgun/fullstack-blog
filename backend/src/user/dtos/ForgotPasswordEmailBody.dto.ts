import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordEmailBodyDto {
  @IsEmail()
  @ApiProperty({
    example: 'test@gmail.com',
  })
  email: string;
}
