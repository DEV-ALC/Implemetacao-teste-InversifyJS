import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReportService } from "./report-service";
import { InvalidReportSizeError } from "../domain/errors/invalid-report-size.error";
import { IMailer } from "../domain/interfaces/mailer.interface";
import { ILogger } from "../domain/interfaces/logger.interface";

describe("ReportService", () => {
  let mailerMock: IMailer;
  let loggerMock: ILogger;
  let service: ReportService;

  beforeEach(() => {
    mailerMock = {
      send: vi.fn().mockResolvedValue(undefined),
    };

    loggerMock = {
      info: vi.fn(),
      error: vi.fn?.(),
      warn: vi.fn?.(),
    } as ILogger;

    service = new ReportService(mailerMock, loggerMock);
  });

  it("deve dar erro se for menor que 1", async () => {
    await expect(
      service.generateAndSend("dfsfsfs@gmail.com", -5)
    ).rejects.toBeInstanceOf(InvalidReportSizeError);
  });

  it("deve dar erro se for maior que 10", async () => {
    await expect(
      service.generateAndSend("sfsfsdfsewr@gmail.com", 15)
    ).rejects.toBeInstanceOf(InvalidReportSizeError);
  });

  it("deve gerar e enviar email corretamente", async () => {
    const email = "dfdsfs@gmail.com";
    const n = 5;

    await service.generateAndSend(email, n);

    expect(mailerMock.send).toHaveBeenCalled();

    expect(mailerMock.send).toHaveBeenCalledWith(
      email,
      "Relatório gerado",
      expect.any(String)
    );

    expect(loggerMock.info).toHaveBeenCalled();
  });
});
