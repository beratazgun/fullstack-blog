import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const responseException = exception.getResponse();

    console.log(responseException);

    if (responseException['message'][0] instanceof ValidationError) {
      return this.transformValidationErrors(
        responseException,
        response,
        status,
      );
    } else {
      response.status(status).json({
        isSuccess: false,
        statusCode: status,
        message: responseException['message'],
        status: responseException['error'],
      });
    }
  }

  private transformValidationErrors(
    responseException: string | object,
    response: Response,
    status: number,
  ) {
    const validationErrors: {
      [key: string]: string;
    } = {};

    responseException['message'].map((validationError: ValidationError) => {
      validationErrors[validationError['property']] = Object.values(
        validationError.constraints,
      )[0];
    });

    return response.status(status).json({
      isSuccess: false,
      statusCode: status,
      message: 'Validation failed',
      validationErrors,
      status: responseException['error'],
    });
  }
}
