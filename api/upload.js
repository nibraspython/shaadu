const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Store uploaded files with custom URLs
const fileDatabase = {};

router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // Upload to GoFile.io
        const response = await fetch("https://store1.gofile.io/uploadFile", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.status !== "ok" || !result.data.downloadPage) {
            console.error("GoFile Error:", result);
            return res.status(500).json({ error: "Upload failed on GoFile.io!" });
        }

        const fileUrl = result.data.downloadPage;
        const filename = req.file.originalname;

        // Store custom filename mapping
        fileDatabase[filename] = fileUrl;

        res.json({
            success: true,
            file_url: `https://shaadu.vercel.app/uploads/${filename}`,
            original_url: fileUrl,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed. Try again!" });
    }
});

// Serve uploaded files with custom URLs
router.get("/:filename", (req, res) => {
    const filename = req.params.filename;

    if (fileDatabase[filename]) {
        return res.redirect(fileDatabase[filename]); // Redirect to actual file URL
    } else {
        return res.status(404).json({ error: "File not found!" });
    }
});

app.use("/api/upload", router);
app.use("/uploads", router);

module.exports = app;
