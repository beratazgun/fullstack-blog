import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

import helmet from 'helmet';
import { HttpExceptionFilter } from '@src/core/filters/HttpException.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  app.setViewEngine('ejs');
  app.useStaticAssets(join(__dirname, '..', 'src/core/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/core/templates'));

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors), // this will throw the error if the validation fails.
      whitelist: true, // this will remove all the extra fields from the request body
    }),
  ); // this is for global validation

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    credentials: true, // This is important.
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
  });

  app.use(
    helmet({
      xssFilter: true, // XSS attack
      frameguard: true, // Clickjacking
      hsts: true, // HTTP Strict Transport Security
      noSniff: true, // MIME sniffing
      hidePoweredBy: true, // Hide X-Powered-By
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Bero-blog API')
    .setDescription('The AutoHireHub API description')
    .setVersion('1.0')
    .addTag('User', 'User API')
    .addTag('Blogs', 'Blogs API')
    .addTag('ReadingLists', 'Reading Lists API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<string>('PORT'));
}

bootstrap();
