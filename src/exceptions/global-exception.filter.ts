import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ExceptionFilter, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { ErrorResponse } from '../types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();
    const timestamp: string = new Date().toISOString();
    const errorResponse: ErrorResponse = {
      path: request?.url,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp,
    };

    if (exception instanceof HttpException) {
      errorResponse.statusCode = exception?.getStatus();
      errorResponse.message = exception?.message;
    }

    if (errorResponse?.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(exception);
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
