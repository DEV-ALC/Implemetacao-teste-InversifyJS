export class InvalidReportSizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidReportSizeError";
  }
}
