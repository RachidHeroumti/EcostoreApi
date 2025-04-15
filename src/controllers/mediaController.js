import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const UploadMediaToCloudinary = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "Uploads" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }

            resolve({
              public_id: result.public_id,
              url: result.secure_url,
              format: result.format,
            });
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("UploadMediaToCloudinary error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const getMedia = async (req, res) => {
  try {
    const cursor = req.query.cursor || null; 
    const limit = parseInt(req.query.limit) || 12;

    const searchQuery = cloudinary.search
      .expression("folder:Uploads")
      .sort_by("created_at", "desc")
      .max_results(limit);

    if (cursor) {
      searchQuery.next_cursor(cursor); 
    }

    const { resources, total_count, next_cursor } = await searchQuery.execute();

    if (!resources || resources.length === 0) {
      return res.status(404).json({
        message: "No media files found",
        files: [],
        hasMore: false,
        nextCursor: null,
      });
    }

    const mediaFiles = resources.map((file) => ({
      public_id: file.public_id,
      url: file.secure_url,
      format: file.format,
      created_at: file.created_at,
    }));

    const hasMore = !!next_cursor;

    return res.status(200).json({
      message: "Media files retrieved successfully",
      files: mediaFiles,
      hasMore,
      nextCursor: next_cursor || null, 
      total: total_count,
    });
  } catch (error) {
    console.error("getMedia error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};