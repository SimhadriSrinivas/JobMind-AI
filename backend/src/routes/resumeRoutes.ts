import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Resume API is available",
  });
});

export default router;
