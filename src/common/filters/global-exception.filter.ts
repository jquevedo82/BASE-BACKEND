// global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Response } from 'express';
import { Logger } from 'winston';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const result = exception.getResponse();
    console.log(result);

    const startTime = Date.now();

    this.writeLog(startTime, request, status, result);

    response.status(status).json({
      statusCode: status,
      status: 'error',
      message: result['message'],
      error: result['error']
    });
  }
  public writeLog(
    startTime: any,
    request: any,
    statusCode: number,
    response: any,
  ) {
    this.logger.log({
      level: 'error',
      message: response.message,
      statusCode: statusCode,
      method: request['method'],
      url: request['url'],
      user: request['user'],
      duration: Date.now() - startTime,
    });
  }
}
