export interface IReportService {
  generateAndSend(email: string, reportId: number): Promise<void>;
}
