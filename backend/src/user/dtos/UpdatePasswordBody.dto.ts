import { IsString, Length } from 'class-validator';
import { IsPasswordEqual } from '@src/core/decorators/IsPasswordEqual';
import { IsNotPasswordEqual } from '@src/core/decorators/IsNotPasswordEqual';
import { IsPasswordStrong } from '@src/core/decorators/IsPasswordStrong';

export class UpdatePasswordBodyDto {
  @IsString()
  @Length(6, 30)
  currentPassword: string;

  @IsString()
  @IsNotPasswordEqual('currentPassword', {
    message: 'New Password and current password should not be same.',
  })
  @IsPasswordStrong({
    message(validationArguments) {
      const [warning] = validationArguments.constraints;
      return `${warning}`;
    },
  })
  newPassword: string;

  @IsString()
  @IsPasswordEqual('newPassword', {
    message: 'New Password and confirm password should be same.',
  })
  newPasswordConfirmation: string;
}
