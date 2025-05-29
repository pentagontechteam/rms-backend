import { Router } from "express";
import {
  getSingleUploadUrl,
  deleteUploadedFile,
} from "../controllers/uploadsController";
import { verifyJWT } from "../middleware/verifyJWT";

const uploadRouter = Router();

uploadRouter.post("/uploads/get-url", verifyJWT, getSingleUploadUrl);
uploadRouter.post("/uploads/delete", verifyJWT, deleteUploadedFile);

export default uploadRouter;
