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

    const startTime = Date.now();
    request['message'] = exception.message;

    this.writeLog(startTime, request, status);

    response.status(status).json({
      statusCode: status,
      status: 'error',
      message: exception.message,
    });
  }
  public writeLog(startTime: any, request: any, statusCode: number) {
    this.logger.log({
      level: 'error',
      message: request['message'],
      statusCode: statusCode,
      method: request['method'],
      url: request['url'],
      user: request['user'],
      duration: Date.now() - startTime,
    });
  }
}
