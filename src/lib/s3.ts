import AWS from "aws-sdk";
// import { v4 as uuidv4 } from "uuid";

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
  bucketName: string;
};

export class AWSS3Uploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    AWS.config.update({
      region: config.region || "eu-north-1",
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });
    this.s3 = new AWS.S3();
    this.config = config;
  }

  private getMimeType(extension: string): string {
    const types: Record<string, string> = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc: "application/msword",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xls: "application/vnd.ms-excel",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ppt: "application/vnd.ms-powerpoint",
      csv: "text/csv",
      txt: "text/plain",
    };
    return types[extension.toLowerCase()] || "application/octet-stream";
  }

  protected async createSignedUrl(vendor: string, originalFilename: string): Promise<{ key: string; url: string }> {
    const fileExt = originalFilename.split(".").pop()?.toLowerCase() || "bin";
    const now = new Date();
      
    // format: YYYY-MM-DD_HH-MM-SS (e.g., 2023-08-15_14-30-22)
    const timestamp = now.toISOString()
      .replace(/T/, '_')
      .replace(/\..+/, '')
      .replace(/:/g, '-');

    const randomString = this.generateRandomAlphaNumeric(4);
    const safeName = `${randomString}-${timestamp}.${fileExt}`;
    const key = `${vendor}/${safeName}`;
    const contentType = this.getMimeType(fileExt);

    const params = {
      Bucket: this.config.bucketName,
      Key: key,
      Expires: 900,
      ContentType: contentType,
    };

    const url = await this.s3.getSignedUrlPromise("putObject", params);
    return { key, url };
  }

  private generateRandomAlphaNumeric(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

  // Supports uploading a single file
  public async singleUpload(vendor: string, originalFilename: string): Promise<{ key: string; url: string }> {
    return await this.createSignedUrl(vendor, originalFilename);
  }

  // Delete object by key
  public async deleteObject(key: string): Promise<void> {
    const params = {
      Bucket: this.config.bucketName,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }
}
