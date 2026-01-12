import "reflect-metadata";
import "dotenv/config";
import express from "express";
import container from "./shared/container/container";
import { ReportController } from "./modules/reports/adapter/http/report.controller";
import { TYPES } from "./shared/container/types";

const controller = container.get<ReportController>(TYPES.ReportController);

const app = express();
app.use(express.json());

app.get("/relatorio/:n", (req, res) => controller.sendReport(req, res));

const PORT = Number(process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});
