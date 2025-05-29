import { Request, Response } from "express";
import { db } from "../db";

// Create Vendor
export const createVendor = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const vendor = await db.vendor.create({
      data: { name },
      include: {
        users: {
          select: { id: true, fullName: true, email: true }
        },
        files: true,
      },
    });
    res.status(201).json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create vendor", error: err });
  }
};

// Get All Vendors
export const getVendors = async (_req: Request, res: Response) => {
  try {
    const vendors = await db.vendor.findMany({
      include: {
        users: {
          select: { id: true, fullName: true, email: true }
        },
        files: true,
      },
    });
    res.status(200).json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch vendors", error: err });
  }
};

// Get Vendor by ID
export const getVendorById = async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  try {
    const vendor = await db.vendor.findUnique({
      where: { id: vendorId },
      include: {
        users: {
          select: { id: true, fullName: true, email: true }
        },
        files: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch vendor", error: err });
  }
};

// Get Vendor by name
export const getVendorByName = async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const vendor = await db.vendor.findUnique({
      where: { id: name },
      include: {
        users: {
          select: { id: true, fullName: true, email: true }
        },
        files: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch vendor", error: err });
  }
};

// Update Vendor
export const updateVendor = async (req: Request, res: Response) => {
  const { vendorId } = req.params;
  const { name } = req.body;

  try {
    const vendor = await db.vendor.update({
      where: { id: vendorId },
      data: { name },
    });

    res.status(200).json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update vendor", error: err });
  }
};

// Delete Vendor
export const deleteVendor = async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  try {
    await db.vendor.delete({
      where: { id: vendorId },
    });

    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete vendor", error: err });
  }
};

// Add User to Vendor
export const addUserToVendor = async (req: Request, res: Response) => {
  const { vendorId, userId } = req.body;

  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        vendorId: vendorId,
      },
    });

    res.status(200).json({ message: "User added to vendor successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add user to vendor", error: err });
  }
};
