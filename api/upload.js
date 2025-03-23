const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

const FILES_JSON = path.join(__dirname, "files.json");

// Function to load existing files
function loadFiles() {
    if (fs.existsSync(FILES_JSON)) {
        return JSON.parse(fs.readFileSync(FILES_JSON));
    }
    return [];
}

// Function to save files
function saveFileData(data) {
    fs.writeFileSync(FILES_JSON, JSON.stringify(data, null, 2));
}

// Upload API
app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}-${req.file.originalname}`;
    const files = loadFiles();
    files.push({ name: req.file.originalname, url: fileUrl });
    saveFileData(files);

    res.json({ success: true, file_url: fileUrl });
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;
