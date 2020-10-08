import * as winston from 'winston'
import { Logger } from 'winston'

const customLevels = {
  levels: {
    error: 0,
    info: 2,
    iiko: 1,
  },
  colors: {
    error: 'bold red whiteBG',
    info: 'blue',
    iiko: 'bold magenta whiteBG',
  },
}

export class LoggerService {
  private logger: Logger

  constructor() {
    this.logger = winston.createLogger({
      levels: customLevels.levels,
      transports: [
        new winston.transports.Console({
          level: 'iiko',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.splat(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/infoLog.txt',
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/errorLog.txt',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/iikoLog.txt',
          level: 'iiko',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            winston.format.splat(),
            winston.format.simple()
          ),
        }),
      ],
    })
    winston.addColors(customLevels.colors)
  }

  info(msg: string) {
    this.logger.info(msg)
  }

  warn(msg: string) {
    this.logger.warn(msg)
  }

  error(msg: string) {
    this.logger.error(msg)
  }
  iiko(msg: string, object: any) {
    this.logger.log('iiko', msg + '%s', object)
  }
}
