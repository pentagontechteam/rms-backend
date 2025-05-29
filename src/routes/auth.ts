import { Router } from "express";
import {
  handleLogout,
  handlePersistentLogin,
  handleRefreshToken,
  loginUser,
  addUser,
} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/auth/user", addUser);

authRouter.post("/auth/login", loginUser);
authRouter.get("/auth/refresh", handleRefreshToken);
authRouter.get("/auth/login/persist", handlePersistentLogin);
authRouter.post("/auth/logout", handleLogout);

export default authRouter;
