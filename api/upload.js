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

        // Upload to GoFile.io (alternative to file.io)
        const response = await fetch("https://store1.gofile.io/uploadFile", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.status !== "ok" || !result.data.downloadPage) {
            console.error("GoFile Error:", result);
            return res.status(500).json({ error: "Upload failed on GoFile.io!" });
        }

        res.json({
            success: true,
            file_url: result.data.downloadPage,
            file_name: req.file.originalname,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed. Try again!" });
    }
});

app.use("/api/upload", router);

module.exports = app;
