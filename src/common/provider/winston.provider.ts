import * as winston from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

export const winstonProvider = {
  provide: WINSTON_MODULE_PROVIDER,
  useFactory: () =>
    winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()],
    }),
};
