import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPasswordEqual } from '@src/core/decorators/IsPasswordEqual';
import { IsPasswordStrong } from '@src/core/decorators/IsPasswordStrong';

export class SignupBodyDto {
  @IsString()
  @IsNotEmpty({
    message: 'First name is required.',
  })
  @ApiProperty({
    example: 'testName',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty({
    message: 'Last name is required.',
  })
  @ApiProperty({
    example: 'testName',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty({
    message: 'User name is required.',
  })
  userName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'testmail@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '135792Tt!_',
  })
  @IsPasswordStrong({
    message(validationArguments) {
      const [warning] = validationArguments.constraints;
      return `${warning}`;
    },
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsPasswordEqual('password', {
    message: 'Password and password confirmation should be equal.',
  })
  @ApiProperty({
    example: '135792Tt!_',
  })
  passwordConfirmation: string;
}
