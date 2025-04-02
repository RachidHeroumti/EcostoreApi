import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadDir = path.join(__dirname, "../uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const UploadMediaToCloudinary = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "Uploads",
        });

        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Failed to delete local file:", err);
          }
        });

        return {
          public_id: result.public_id,
          url: result.secure_url,
          format: result.format,
        };
      })
    );

    return res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("UploadMediaToCloudinary error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const UploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const savedFiles = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
      mimeType: file.mimetype,
    }));

    return res.status(200).json({
      message: "Files uploaded successfully",
      files: savedFiles,
    });
  } catch (error) {
    console.error("UploadMedia error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getmedia = async (req, res) => {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:Uploads")
      .sort_by("created_at", "desc")
      .max_results(20)
      .execute();

    if (!resources || resources.length === 0) {
      return res.status(404).json({ message: "No media files found" });
    }
    const mediaFiles = resources.map((file) => ({
      public_id: file.public_id,
      url: file.secure_url,
      format: file.format,
      created_at: file.created_at,
    }));

    return res.status(200).json({
      message: "Media files retrieved successfully",
      files: mediaFiles,
    });
  } catch (error) {
    console.error("getmedia error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
