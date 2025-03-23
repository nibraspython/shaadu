const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");

const app = express();
const uploadDir = path.join(__dirname, "..", "public", "uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to save the file with its original name
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const safeFilename = file.originalname.replace(/\s+/g, "_"); // Replace spaces with underscores
        cb(null, safeFilename);
    },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const fileUrl = `https://shaadu.vercel.app/uploads/${req.file.filename}`;
    res.json({ success: true, file_url: fileUrl });
});

module.exports = app;
