const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.json({ success: false, error: "No file uploaded" });
    }

    try {
        const formData = new FormData();
        formData.append("file", Buffer.from(req.file.buffer), req.file.originalname);

        const response = await fetch("https://file.io", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            return res.json({ success: true, file_url: result.link });
        } else {
            return res.json({ success: false, error: "Failed to upload to file.io" });
        }
    } catch (error) {
        return res.json({ success: false, error: "Upload Error" });
    }
});

module.exports = app;
