const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const router = express.Router();

// Use memory storage (no disk storage)
const upload = multer({ storage: multer.memoryStorage() });

// Upload endpoint
router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // Upload to file.io
        const response = await fetch("https://file.io", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!result.success) {
            return res.status(500).json({ error: "File upload failed!" });
        }

        res.json({
            success: true,
            file_url: result.link, // Temporary file link
            file_name: req.file.originalname,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed. Try again!" });
    }
});

app.use("/api/upload", router);

module.exports = app;
