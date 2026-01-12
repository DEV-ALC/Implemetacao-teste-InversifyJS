import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/container/types";
import { InvalidReportSizeError } from "../domain/errors/invalid-report-size.error";
import { ILogger } from "../domain/interfaces/logger.interface";
import { IMailer } from "../domain/interfaces/mailer.interface";
import { IReportService } from "../domain/interfaces/report-service.interface";
import { faker } from "@faker-js/faker";
import { isValidEmail } from "../../../shared/validator/email.validator";
import { Console } from "console";

@injectable()
export class ReportService implements IReportService {
  constructor(
    @inject(TYPES.Mailer) private mailer: IMailer,
    @inject(TYPES.Logger) private logger: ILogger
  ) {}

  async generateAndSend(email: string, n: number): Promise<void> {
    if (n < 1 || n > 10) {
      throw new InvalidReportSizeError("n deve ser entre 1 e 10");
    }
    if (!isValidEmail(email)) {
      console.log(email);
      throw new InvalidReportSizeError("Email invalido!");
    }

    this.logger.info(`Gerando relatório com ${n} registros...`);

    const records = Array.from({ length: n }).map(() => ({
      nome: faker.person.fullName(),
      cidade: faker.location.city(),
    }));

    const body = `<h1>Relatório</h1><pre>${JSON.stringify(
      records,
      null,
      2
    )}</pre>`;

    await this.mailer.send(email, "Relatório gerado", body);

    this.logger.info(`Relatório enviado para ${email}`);
  }
}
