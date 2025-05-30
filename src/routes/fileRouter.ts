import { Router } from "express";
import {
  uploadFile,
  getFiles,
  getFileById,
  deleteFile,
  getWeeklyReports,
  getReportFileTypeGraphData,
  getDailyReports,
} from "../controllers/fileController";
import { verifyJWT } from "../middleware/verifyJWT";

const fileRouter = Router();

fileRouter.post("/files", verifyJWT, uploadFile);
fileRouter.get("/files", verifyJWT, getFiles);
fileRouter.get("/files/:fileId", verifyJWT, getFileById);
fileRouter.delete("/files/:fileId", deleteFile);

fileRouter.get("/reports/weekly", verifyJWT, getWeeklyReports);
fileRouter.get("/reports/daily", verifyJWT, getDailyReports);
fileRouter.get("/reports/file-type-graph", verifyJWT, getReportFileTypeGraphData);

export default fileRouter;
