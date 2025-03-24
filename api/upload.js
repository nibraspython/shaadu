const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const router = express.Router();

// Memory storage (avoids file system issues)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // Upload to file.io (temporary file storage)
        const response = await fetch("https://file.io/", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!result.success || !result.link) {
            console.error("File.io Error:", result);
            return res.status(500).json({ error: "Upload failed on file.io!" });
        }

        res.json({
            success: true,
            file_url: result.link,
            file_name: req.file.originalname,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed. Try again!" });
    }
});

app.use("/api/upload", router);

module.exports = app;
