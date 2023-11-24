import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as path from 'path';

export const loggerOptions = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike(),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      dirname: 'src/log/info/',
      filename: 'info.log',
      level: 'info',
    }),
    new winston.transports.File({
      dirname: 'src/log/debug/',
      filename: 'debug.log',
      level: 'debug',
    }),
    new winston.transports.File({
      dirname: 'src/log/error/',
      filename: 'error.log',
      level: 'error',
    }),
    new winston.transports.Console({ level: 'debug' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'src/log/exceptions/exceptions.log',
      maxsize: 5242880,
    }),
  ],
  exitOnError: false,
  propagate: false,
};
