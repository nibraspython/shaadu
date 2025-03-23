const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "/tmp/" }); // Save files temporarily

app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    // Rename file to match original filename
    const tempPath = req.file.path;
    const newPath = `/tmp/${req.file.originalname}`;

    fs.rename(tempPath, newPath, (err) => {
        if (err) {
            return res.status(500).json({ success: false, error: "File rename failed" });
        }

        // Temporary File URL (will be deleted when the instance restarts)
        const fileUrl = `https://${req.headers.host}/api/file/${req.file.originalname}`;

        res.json({ success: true, file_url: fileUrl });
    });
});

// Serve the uploaded file temporarily
app.get("/api/file/:filename", (req, res) => {
    const filePath = `/tmp/${req.params.filename}`;

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ success: false, error: "File not found" });
    }
});

module.exports = app;
