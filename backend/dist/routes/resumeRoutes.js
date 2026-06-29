"use strict";
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });
router.post("/upload", upload.single("resume"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded",
        });
    }
    res.json({
        message: "Resume uploaded successfully",
        file: req.file.filename,
    });
});
module.exports = router;
