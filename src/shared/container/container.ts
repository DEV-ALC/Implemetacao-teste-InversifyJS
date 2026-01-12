import { Container } from "inversify";
import { TYPES } from "./types";
import { ILogger } from "../../modules/reports/domain/interfaces/logger.interface";
import { IMailer } from "../../modules/reports/domain/interfaces/mailer.interface";
import { IReportService } from "../../modules/reports/domain/interfaces/report-service.interface";
import { LoggerService } from "../../modules/reports/infra/logger/loggerService";
import { MailerService } from "../../modules/reports/infra/mail/emailService";
import { ReportService } from "../../modules/reports/application/report-service";
import { ReportController } from "../../modules/reports/adapter/http/report.controller";

const container = new Container();

container.bind<ReportController>(TYPES.ReportController).to(ReportController);
container.bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
container.bind<IMailer>(TYPES.Mailer).to(MailerService).inSingletonScope();
container.bind<IReportService>(TYPES.ReportService).to(ReportService);

export default container;
