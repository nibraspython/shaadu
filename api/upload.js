const fetch = require("node-fetch");
const FormData = require("form-data");
const multer = require("multer");
const express = require("express");

const app = express();
const upload = multer();

app.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    // Upload file to File.io
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    try {
        const response = await fetch("https://file.io", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (result.success) {
            res.json({ success: true, file_url: result.link });
        } else {
            res.status(500).json({ success: false, error: "Upload failed" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

module.exports = app;
