import { Router } from "express";
import {
  uploadFile,
  getFiles,
  getFileById,
  deleteFile,
} from "../controllers/fileController";
import { verifyJWT } from "../middleware/verifyJWT";

const fileRouter = Router();

fileRouter.post("/files", verifyJWT, uploadFile);
fileRouter.get("/files", verifyJWT, getFiles);
fileRouter.get("/files/:fileId", verifyJWT, getFileById);
fileRouter.delete("/files/:fileId", deleteFile);

export default fileRouter;
