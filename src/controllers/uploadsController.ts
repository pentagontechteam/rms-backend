// uploads.controller.ts
import { Request, Response } from "express";
import { AWSS3Uploader } from "../lib/s3";
import { db } from "../db";
import { Prisma } from "@prisma/client";
import { Interface } from "readline";

const uploader = new AWSS3Uploader({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION || "eu-north-1",
  bucketName: process.env.AWS_BUCKET_NAME!,
});

type User = Prisma.UserGetPayload<{
  include: {
    vendor: {
      select: { id: true, name: true }
    }
  }
}>

export const getSingleUploadUrl = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { type, filename } = req.body;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!filename) return res.status(400).json({ message: "Missing 'filename'" });

  let user: User;
  try {
    user = await db.user.findFirst({ 
      where: { id: userId }, 
      include: {
      vendor: {
        select: { id: true, name: true,}
      },
    }, 
  })
  } catch (error) {
    return res.status(401).json({ message: "Could not Retrive Vendor" });
  }

  try {
    const { key, url } = await uploader.singleUpload(user.vendor.name, filename);
    return res.status(200).json({ key, url });
  } catch (err) {
    console.error("Failed to create signed upload URL:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUploadedFile = async (req: Request, res: Response) => {
  const { key } = req.body;

  if (!key) return res.status(400).json({ message: "Missing 'key'" });

  try {
    await uploader.deleteObject(key);
    return res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Failed to delete file from S3:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
