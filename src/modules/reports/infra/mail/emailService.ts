import { inject, injectable } from "inversify";
import { IMailer } from "../../domain/interfaces/mailer.interface";
import nodemailer from "nodemailer";
import { ILogger } from "../../domain/interfaces/logger.interface";
import { TYPES } from "../../../../shared/container/types";
import { isProd } from "../../../../shared/utils/isProd";

let transporter: nodemailer.Transporter | null = null;

const getClient = async () => {
  if (transporter) return transporter;

  if (!isProd) {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      throw new Error("Variáveis SMTP não definidas para produção!");
    }

    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
  });

  return transporter;
};

@injectable()
export class MailerService implements IMailer {
  constructor(@inject(TYPES.Logger) private logger: ILogger) {}

  async send(to: string, subject: string, body: string) {
    try {
      const client = await getClient();
      const info = await client.sendMail({ to, subject, html: body });
      const url = nodemailer.getTestMessageUrl(info);
      if (url) this.logger.info(`Preview URL: ${url}`);
    } catch (e) {
      this.logger.error(`Erro ao Enviar email: ${e}`);
    }
  }
}
