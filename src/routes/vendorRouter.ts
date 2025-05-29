import { Router } from "express";
import {
  createVendor,
  getVendors,
  getVendorById,
  getVendorByName,
  updateVendor,
  deleteVendor,
  addUserToVendor,
} from "../controllers/vendorController";

const vendorRouter = Router();

vendorRouter.post("/vendors", createVendor);
vendorRouter.get("/vendors", getVendors);
vendorRouter.get("/vendors/:vendorId", getVendorById);
vendorRouter.get("/vendors/name/:name", getVendorByName);
vendorRouter.put("/vendors/:vendorId", updateVendor);
vendorRouter.delete("/vendors/:vendorId", deleteVendor);
vendorRouter.post("/vendors/add-user", addUserToVendor);

export default vendorRouter;
