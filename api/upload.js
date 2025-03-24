const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Store uploaded files in memory
const fileStorage = {};

router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        const response = await fetch("https://store1.gofile.io/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!result.status || result.status !== "ok") {
            console.error("GoFile Error:", result);
            return res.status(500).json({ error: "Upload failed on GoFile.io!" });
        }

        // Store the file reference
        const fileUrl = result.data.downloadPage;
        fileStorage[req.file.originalname] = fileUrl;

        res.json({
            success: true,
            file_url: `/uploads/${req.file.originalname}`, // Custom URL
            original_url: fileUrl, // GoFile.io URL
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed. Try again!" });
    }
});

// Serve stored files via /uploads/:filename
router.get("/:filename", (req, res) => {
    const filename = req.params.filename;
    const fileUrl = fileStorage[filename];

    if (!fileUrl) {
        return res.status(404).json({ error: "File not found!" });
    }

    res.redirect(fileUrl); // Redirect to GoFile.io URL
});

app.use("/api/upload", router);
app.use("/uploads", router);

module.exports = app;
