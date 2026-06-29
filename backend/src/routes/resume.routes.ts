import { Router } from "express";
import {
  deleteMyResume,
  getMyMasterResume,
  replaceMyResume,
  uploadMyResume,
} from "../controllers/resume.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadResumeFile } from "../middleware/multer.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/upload", uploadResumeFile, uploadMyResume);
router.get("/me", getMyMasterResume);
router.delete("/:id", deleteMyResume);
router.patch("/:id", uploadResumeFile, replaceMyResume);

export default router;
