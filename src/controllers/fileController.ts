import { Request, Response } from "express";
import { db } from "../db";
import { Prisma } from "@prisma/client";

type User = Prisma.UserGetPayload<{}>

// Upload (Create) a new file entry
export const uploadFile = async (req: Request, res: Response) => {
  const { name, type, size, url, path, vendorId } = req.body;
  const sharedById = req.userId;

  if (!name || !type || !size || !url || !vendorId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const file = await db.file.create({
      data: {
        name,
        type,
        size: Number(size),
        url,
        path: path || "",
        vendorId,
        sharedById,
      },
      include: {
        sharedBy: { select: { id: true, fullName: true } },
        vendor: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(file);
  } catch (error) {
    console.error("File Upload Error:", error);
    res.status(500).json({ message: "Failed to upload file", error });
  }
};

// Get all files (optional filters: vendorId, userId)
export const getFiles = async (req: Request, res: Response) => {
  const userId = req.userId;
  const vendorSlug = req.query.vendor as string | undefined;

  // let user: User;
  //   try {
  //     user = await db.user.findFirst({ 
  //       where: { id: userId }
  //   })
  //   } catch (error) {
  //     return res.status(401).json({ message: "Could not Retrive Vendor" });
  //   }

  const vendor = await db.vendor.findUnique({
    where: { name: vendorSlug },
  });




  try {
    const files = await db.file.findMany({
      where: {
       vendorId: vendor.id 
      },
      orderBy: { sharedAt: "desc" },
      include: {
        sharedBy: { select: { id: true, fullName: true } },
        vendor: { select: { id: true, name: true } },
      },
    });

    res.status(200).json(files);
  } catch (error) {
    console.error("Get Files Error:", error);
    res.status(500).json({ message: "Failed to fetch files", error });
  }
};

// Get a specific file by ID
export const getFileById = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    const file = await db.file.findUnique({
      where: { id: fileId },
      include: {
        sharedBy: { select: { id: true, fullName: true } },
        vendor: { select: { id: true, name: true } },
      },
    });

    if (!file) return res.status(404).json({ message: "File not found" });

    res.status(200).json(file);
  } catch (error) {
    console.error("Get File By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch file", error });
  }
};

// Delete a file by ID
export const deleteFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    await db.file.delete({
      where: { id: fileId },
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete File Error:", error);
    res.status(500).json({ message: "Failed to delete file", error });
  }
};
