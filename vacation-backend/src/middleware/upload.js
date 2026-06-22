const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");

// Use memory storage — files are uploaded to Cloudinary after multer processes them
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "vacation",
      resource_type: "image",
      ...options,
    };
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(fileBuffer);
  });
};

// Helper: delete image from Cloudinary by public_id
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

// Extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary")) return null;
  // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/vacation/filename.ext
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  const pathWithVersion = parts[1];
  // Remove version prefix (v123456/)
  const withoutVersion = pathWithVersion.replace(/^v\d+\//, "");
  // Remove file extension
  const publicId = withoutVersion.replace(/\.[^.]+$/, "");
  return publicId;
};

module.exports = upload;
module.exports.uploadToCloudinary = uploadToCloudinary;
module.exports.deleteFromCloudinary = deleteFromCloudinary;
module.exports.getPublicIdFromUrl = getPublicIdFromUrl;
