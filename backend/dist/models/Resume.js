"use strict";
const mongoose = require("mongoose");
const ResumeSchema = new mongoose.Schema({
    fileName: String,
    content: String,
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Resume", ResumeSchema);
