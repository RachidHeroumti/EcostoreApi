import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"; 
import {  getMedia, UploadMediaToCloudinary } from "../controllers/mediaController.js";
import { protect, protectAdmin } from "../middlwares/authMidlware.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/");

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}-${file.originalname}`);
  },
}); 

const upload = multer({ storage });

const route = express.Router();

route.post("/upload", protect, protectAdmin, upload.array("media", 10), UploadMediaToCloudinary);
route.get("/find", getMedia);

export default route;
