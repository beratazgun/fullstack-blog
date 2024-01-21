import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientKnownRequestErrorFilter } from '@src/core/filters/PrismaClientKnownRequestError.filter';
import { PrismaClientValidationErrorFilter } from '@src/core/filters/PrismaClientValidationError.filter';
import { AwsS3Module } from './aws/aws-s3/aws-s3.module';
import { PrismaModule } from './prisma/prisma.module';
import { BlogModule } from './blog/blog.module';
import { JwtModule } from '@nestjs/jwt';
import { ImagesModule } from './images/images.module';
import { TagsModule } from './tags/tags.module';
import { ReadingListsModule } from './reading-lists/reading-lists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
    AwsS3Module,
    UserModule,
    PrismaModule,
    BlogModule,
    ImagesModule,
    TagsModule,
    ReadingListsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientKnownRequestErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientValidationErrorFilter,
    },
  ],
})
export class AppModule {}
