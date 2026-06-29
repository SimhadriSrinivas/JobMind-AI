import { Router } from "express";
import {
  createMyProfile,
  deleteMyProfile,
  getMyProfile,
  updateMyProfile,
} from "../controllers/profile.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createMyProfile);
router.get("/me", getMyProfile);
router.patch("/me", updateMyProfile);
router.delete("/me", deleteMyProfile);

export default router;
