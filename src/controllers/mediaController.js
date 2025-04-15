import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs/promises";

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

    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "Uploads",
          });
          await fs.unlink(file.path);

          return {
            public_id: result.public_id,
            url: result.secure_url,
            format: result.format,
          };
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          throw uploadError;
        }
      })
    );

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