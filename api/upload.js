const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // Upload to File.io
        const response = await fetch("https://file.io/", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!result.success || !result.link) {
            console.error("File.io Upload Error:", result);
            return res.status(500).json({ error: "Upload failed on File.io!" });
        }

        const fileUrl = result.link;

        res.json({
            success: true,
            file_url: `/uploads/${req.file.originalname}`,
            original_url: fileUrl, // Actual download link
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed. Try again!" });
    }
});

// Custom URL Redirection
router.get("/:filename", (req, res) => {
    return res.status(404).json({ error: "File not found!" });
});

app.use("/api/upload", router);
app.use("/uploads", router);

module.exports = app;
