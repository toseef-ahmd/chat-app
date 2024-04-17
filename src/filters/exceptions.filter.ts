import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoServerError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';

@Catch(Error)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(
    exception: Error | HttpException | MongoServerError | MongooseError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const defaultErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: ['An unexpected error occurred'],
    };

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      this.handleHttpException(exception, response);
    } else if ((exception as MongoServerError).code === 11000) {
      this.handleMongoDBError(exception as MongoServerError, response);
    } else if (exception instanceof MongooseError.ValidationError) {
      this.handleMongooseValidationError(exception, response);
    } else if (exception instanceof MongooseError.CastError) {
      this.handleCastError(exception, response);
    } else {
      this.handleUnknownError(exception, response, status);
    }
  }

  private handleHttpException(exception: HttpException, response: Response) {
    const responsePayload = exception.getResponse();
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      error: responsePayload['error'] || 'Http Error',
      message: Array.isArray(responsePayload['message'])
        ? responsePayload['message']
        : [responsePayload['message']],
    });
  }

  private handleMongoDBError(exception: MongoServerError, response: Response) {
    const field = Object.keys(exception.keyValue)[0];
    const value = exception.keyValue[field];
    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      error: 'Conflict',
      message: [`${field} with value ${value} already exists`],
    });
  }

  private handleMongooseValidationError(
    exception: MongooseError.ValidationError,
    response: Response,
  ) {
    const messages = Object.values(exception.errors).map((err) => err.message);
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Validation Error',
      message: messages,
    });
  }

  private handleCastError(
    exception: MongooseError.CastError,
    response: Response,
  ) {
    this.logger.error('Cast Error', exception.message);
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: ['ID should be a valid ObjectId'],
    });
  }

  private handleUnknownError(
    exception: Error,
    response: Response,
    status: number,
  ) {
    this.logger.error('Internal Server Error', exception.stack);
    response.status(status).json({
      statusCode: status,
      error: 'Internal Server Error',
      message: ['An unexpected error occurred', exception.message],
    });
  }
}
