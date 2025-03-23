const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "/tmp/" });

app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        console.error("❌ No file received.");
        return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    console.log("✅ File received:", req.file);

    // Rename and move file
    const tempPath = req.file.path;
    const newPath = `/tmp/${req.file.originalname}`;

    fs.rename(tempPath, newPath, (err) => {
        if (err) {
            console.error("❌ File rename failed:", err);
            return res.status(500).json({ success: false, error: "File rename failed" });
        }

        console.log("✅ File saved at:", newPath);

        const fileUrl = `https://${req.headers.host}/api/file/${req.file.originalname}`;
        res.json({ success: true, file_url: fileUrl });
    });
});

// Serve temporary files
app.get("/api/file/:filename", (req, res) => {
    const filePath = `/tmp/${req.params.filename}`;

    if (fs.existsSync(filePath)) {
        console.log("✅ Serving file:", filePath);
        res.sendFile(filePath);
    } else {
        console.error("❌ File not found:", filePath);
        res.status(404).json({ success: false, error: "File not found" });
    }
});

module.exports = app;
