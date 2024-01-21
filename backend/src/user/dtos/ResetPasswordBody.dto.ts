import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsPasswordEqual } from '@src/core/decorators/IsPasswordEqual';
import { IsPasswordStrong } from '@src/core/decorators/IsPasswordStrong';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordBodyDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  @ApiProperty({
    example: 'password123',
  })
  @IsPasswordStrong({
    message(validationArguments) {
      const [warning] = validationArguments.constraints;
      return `${warning}`;
    },
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsPasswordEqual('newPassword', {
    message: 'New Password and confirm password should be same.',
  })
  @ApiProperty({
    example: 'password123',
  })
  newPasswordConfirmation: string;
}
