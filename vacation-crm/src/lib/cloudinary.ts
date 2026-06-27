import api from "./api";

/** Maximum allowed image file size in bytes (600KB) */
export const MAX_IMAGE_SIZE = 600 * 1024; // 600KB

/**
 * Validate a single image file against the size limit.
 * Returns an error message if invalid, or null if valid.
 */
export function validateImageFile(file: File): string | null {
  if (file.size > MAX_IMAGE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return `"${file.name}" is ${sizeMB}MB which exceeds the 600KB limit. Please compress or resize the image before uploading.`;
  }
  return null;
}

/**
 * Validate multiple image files against the size limit.
 * Returns an array of error messages for invalid files, or empty array if all valid.
 */
export function validateImageFiles(files: File[]): string[] {
  return files
    .map((file) => validateImageFile(file))
    .filter((msg): msg is string => msg !== null);
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface SignatureResponse {
  signature: string;
  timestamp: number;
  folder: string;
  cloudName: string;
  apiKey: string;
}

/**
 * Upload a single file directly to Cloudinary using signed upload.
 * 1. Validates file size (max 600KB)
 * 2. Gets a signature from our backend
 * 3. Uploads directly to Cloudinary (faster, no server bottleneck)
 * 4. Returns the secure_url
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "vacation"
): Promise<string> {
  // Validate file size
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }
  // Step 1: Get signature from backend
  const { data } = await api.get("/cloudinary/signature", {
    params: { folder },
  });
  const sig: SignatureResponse = data.data;

  // Step 2: Upload directly to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", sig.signature);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("folder", sig.folder);
  formData.append("api_key", sig.apiKey);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;

  const res = await fetch(cloudinaryUrl, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Cloudinary upload failed");
  }

  const result: CloudinaryUploadResult = await res.json();
  return result.secure_url;
}

/**
 * Upload multiple files to Cloudinary in parallel.
 * Returns an array of secure_urls.
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  folder: string = "vacation"
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file, folder));
  return Promise.all(uploadPromises);
}
