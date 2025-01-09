import { Injectable } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger = createLogger({
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
          }),
        ),
      }),
      new transports.File({
        filename: 'logs/app.log',
        format: format.combine(format.timestamp(), format.json()),
      }),
    ],
  });

  log(message: string, context?: any) {
    this.logger.info(message, { context });
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} - ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}

export const logger = new WinstonLoggerService();
