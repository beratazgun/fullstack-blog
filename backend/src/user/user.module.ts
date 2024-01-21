import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import EmailManagerService from '@src/core/services/EmailManager';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailManagerService],
})
export class UserModule {}
