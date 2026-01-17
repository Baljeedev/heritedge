import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import r2Client, { R2_BUCKET_NAME } from "../config/r2";
import { randomUUID } from "crypto";

export interface UploadResult {
  url: string;
  key: string;
}

/**
 * Upload a file to Cloudflare R2
 * @param file - File buffer or stream
 * @param folder - Folder path in R2 (e.g., "trips", "guides", "monuments")
 * @param filename - Original filename
 * @param contentType - MIME type of the file
 * @returns Upload result with public URL and key
 */
export async function uploadToR2(
  file: Buffer,
  folder: string,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const extension = filename.split(".").pop() || "";
    const uniqueFilename = `${randomUUID()}.${extension}`;
    const key = `${folder}/${uniqueFilename}`;

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      // Make file publicly accessible (if your R2 bucket is configured for public access)
      // You may need to set up a custom domain for public access
    });

    await r2Client.send(command);

    // Construct public URL
    // If you have a custom domain: https://your-domain.com/{key}
    // Otherwise use R2 public URL (if public access is enabled)
    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL}/${key}`
      : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;

    return {
      url: publicUrl,
      key,
    };
  } catch (error: any) {
    console.error("Error uploading to R2:", error);
    throw new Error(`Failed to upload file to R2: ${error.message}`);
  }
}

/**
 * Delete a file from Cloudflare R2
 * @param key - The key (path) of the file in R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
  } catch (error: any) {
    console.error("Error deleting from R2:", error);
    throw new Error(`Failed to delete file from R2: ${error.message}`);
  }
}

/**
 * Extract R2 key from a URL
 * @param url - Full R2 URL
 * @returns The key (path) in R2
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    // Extract key from URL
    // Format: https://domain.com/folder/filename or https://account.r2.cloudflarestorage.com/bucket/folder/filename
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    
    // Remove bucket name if present
    if (pathParts[0] === R2_BUCKET_NAME) {
      pathParts.shift();
    }
    
    return pathParts.join("/");
  } catch {
    return null;
  }
}