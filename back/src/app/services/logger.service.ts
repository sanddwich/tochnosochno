import * as winston from 'winston'
import { Logger, format } from 'winston'

const customLevels = {
  levels: {
    error: 0,
    info: 1,
    iiko: 2,
  },
  colors: {
    error: 'bold red whiteBG',
    info: 'blue',
  },
}
const { combine, timestamp, printf } = format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

export class LoggerService {
  private logger: Logger

  constructor() {
    this.logger = winston.createLogger({
      levels: customLevels.levels,
      transports: [
        new winston.transports.File({
          filename: `logs/${new Date().toJSON().slice(0, 10)}.txt`,
          level: 'info',
          format: winston.format.combine(winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), logFormat),
        }),
        new winston.transports.File({
          filename: `logs/${new Date().toJSON().slice(0, 10)}.txt`,
          level: 'error',
          format: winston.format.combine(winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), logFormat),
        }),

        new winston.transports.File({
          filename: `iiko_logs/${new Date().toJSON().slice(0, 10)}.txt`,
          level: 'iiko',
          format: winston.format.combine(winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), logFormat),
        }),
      ],
    })
    winston.addColors(customLevels.colors)
  }

  info(msg: string, object?: any) {
    this.logger.log('info', `${msg}${object ? `\n${JSON.stringify(object, null, 4)}` : ''}`)
  }
  iiko(msg: string, object?: any) {
    this.logger.log('iiko', `${msg}${object ? `\n${JSON.stringify(object, null, 4)}` : ''}`)
  }
  error(msg: string, error: any) {
    console.log(error)
    this.logger.log('error', `${msg} \n${JSON.stringify(error.message, null, 4)}`)
  }
}
