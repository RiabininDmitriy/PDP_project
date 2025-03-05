import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService implements LoggerService {
  private context?: string;
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

  setContext(context: string) {
    this.context = context;
  }

  private parseContext(): string {
    const stack = new Error().stack;
    const stackLines = stack.split('\n');
    const callerLine = stackLines[3];
    return callerLine;
  }

  log(message: string) {
    const logContext = this.parseContext();
    this.logger.info(message, { context: this.context || 'Unknown' });
  }

  error(message: string, trace: string) {
    const logContext = this.parseContext();
    this.logger.error(`${message} - ${trace}`, { context: this.context || 'Unknown' });
  }

  warn(message: string) {
    const logContext = this.parseContext();
    this.logger.warn(message, { context: this.context || 'Unknown' });
  }

  debug(message: string) {
    const logContext = this.parseContext();
    this.logger.debug(message, { context: this.context || 'Unknown' });
  }

  verbose(message: string) {
    const logContext = this.parseContext();
    this.logger.verbose(message, { context: this.context || 'Unknown' });
  }
}

export const logger = new WinstonLoggerService();
