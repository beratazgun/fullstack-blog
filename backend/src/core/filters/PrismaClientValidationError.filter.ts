import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response, Request } from 'express';

interface ErrorMapping {
  errorType: string;
  status: string;
  statusCode?: number;
  prismaErrorCode?: string;
  errorKeyword?: string;
}

export const errorMappings: Record<string, ErrorMapping> = {
  P1012: {
    errorType: 'PrismaClientValidationError',
    statusCode: HttpStatus.BAD_REQUEST,
    status: 'Bad Request',
    prismaErrorCode: 'P1012',
    errorKeyword: 'missing',
  },
};

@Catch(PrismaClientValidationError)
export class PrismaClientValidationErrorFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(exception);

    if (exception.name === 'PrismaClientValidationError') {
      response.status(400).json({
        statusCode: 400,
        isSuccess: false,
        status: 'Bad Request',
        message: exception.message.split('\n').reverse()[0],
      });
    } else {
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      super.catch(exception, host);
    }
  }
}
