import { injectable } from "inversify";
import { ILogger } from "../../domain/interfaces/logger.interface";
import winston from "winston";

const isProd = process.env.APP_ENV === "PROD";

const transports = isProd
  ? [new winston.transports.File({ filename: "app.log" })]
  : [new winston.transports.Console()];

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports,
});

@injectable()
export class LoggerService implements ILogger {
  info(msg: string) {
    logger.info(msg);
  }
  warn(msg: string) {
    logger.warn(msg);
  }
  error(msg: string, error?: unknown) {
    logger.error(msg, { error });
  }
}
