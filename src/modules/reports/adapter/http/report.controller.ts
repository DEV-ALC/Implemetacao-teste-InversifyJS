import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { InvalidReportSizeError } from "../../domain/errors/invalid-report-size.error";
import { TYPES } from "../../../../shared/container/types";
import { IReportService } from "../../domain/interfaces/report-service.interface";

@injectable()
export class ReportController {
  constructor(
    @inject(TYPES.ReportService) private reportService: IReportService
  ) {}

  async sendReport(req: Request, res: Response) {
    try {
      const n = Number(req.params.n);
      const email = req.query.email as string;

      if (!email) return res.status(400).json({ message: "Email obrigatório" });

      await this.reportService.generateAndSend(email, n);

      return res.status(200).json({ message: "Relatório enviado com sucesso" });
    } catch (err) {
      if (err instanceof InvalidReportSizeError) {
        return res.status(400).json({ message: err.message });
      }
      console.error(err);
      return res.status(500).json({ message: "Erro interno" });
    }
  }
}
