import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ReportController } from "./report.controller";
import { InvalidReportSizeError } from "../../domain/errors/invalid-report-size.error";
import { IReportService } from "../../domain/interfaces/report-service.interface";
import { Request, Response } from "express";

describe("ReportController", () => {
  let reportServiceMock: IReportService;
  let controller: ReportController;

  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    reportServiceMock = {
      generateAndSend: vi.fn(),
    };

    controller = new ReportController(reportServiceMock);

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it("deve retornar 400 se email não for informado", async () => {
    req = {
      params: { n: "5" },
      query: {},
    };

    await controller.sendReport(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email obrigatório",
    });
  });

  it("deve retornar 400 se o serviço lançar InvalidReportSizeError", async () => {
    req = {
      params: { n: "15" },
      query: { email: "ksfjshfjsd@gmail.com" },
    };

    (reportServiceMock.generateAndSend as any).mockRejectedValue(
      new InvalidReportSizeError("deve ser entre 1 e 10")
    );

    await controller.sendReport(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "deve ser entre 1 e 10",
    });
  });

  it("deve retornar 500 se ocorrer um erro inesperado", async () => {
    req = {
      params: { n: "5" },
      query: { email: "adadada@gmail.com" },
    };

    (reportServiceMock.generateAndSend as any).mockRejectedValue(
      new Error("Database down")
    );

    await controller.sendReport(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro interno",
    });

    expect(console.error).toHaveBeenCalled();
  });
});
