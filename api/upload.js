const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const router = express.Router();

// Store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // Upload to AnonFiles (supports filename in URL)
        const response = await fetch("https://api.anonfiles.com/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!result.status || !result.data.file.url.short) {
            console.error("AnonFiles Error:", result);
            return res.status(500).json({ error: "Upload failed on AnonFiles!" });
        }

        res.json({
            success: true,
            file_url: result.data.file.url.short,  // Filename in the URL
            file_name: req.file.originalname,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed. Try again!" });
    }
});

app.use("/api/upload", router);

module.exports = app;
