import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoServerError } from 'mongodb'; // Ensure you have the correct type definitions

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception: Error | HttpException | MongoServerError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    let status = 500;
    let message = Array<string>();
    let error = 'Internal Server Error';

    console.log(exception);
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      message = Array.isArray(exception.getResponse()['message'])
        ? exception.getResponse()['message']
        : [exception.getResponse()['message']];

      error = exception.getResponse()['error'];
    } else if ((exception as MongoServerError).code === 11000) {
      status = HttpStatus.CONFLICT; // 409

      message = ['A User with this username already exists'];
    }

    console.log(message);
    response.status(status).json({
      statusCode: status,
      error: error,
      message: message,
    });
  }
}
