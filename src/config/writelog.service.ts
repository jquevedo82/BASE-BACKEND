/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class WriteLogService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  public writeLog(
    startTime: any,
    request: any,
    statusCode: number,
    message: string,
  ) {
    this.logger.log({
      level: 'info',
      message: message,
      statusCode: statusCode,
      method: request['method'],
      url: request['url'],
      user: request['user'],
      duration: Date.now() - startTime,
    });
  }
}
