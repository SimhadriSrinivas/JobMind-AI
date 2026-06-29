import fs from "fs";
import { NextFunction, Request, Response } from "express";
import path from "path";
import multer from "multer";
import { ApiError } from "../utils/ApiError";

const uploadsDir = path.resolve(process.cwd(), "uploads");

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new ApiError(400, "Only PDF files are allowed"));
      return;
    }

    cb(null, true);
  },
});

export const uploadResumeFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("resume")(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof ApiError) {
      next(error);
      return;
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      next(new ApiError(400, "Resume PDF must be 5MB or smaller"));
      return;
    }

    next(new ApiError(400, "Unable to upload resume"));
  });
};
