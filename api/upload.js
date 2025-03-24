const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Store uploaded files
const fileStorage = {};

router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // Fetch GoFile API Server List
        const serverResponse = await fetch("https://api.gofile.io/getServer");
        const serverData = await serverResponse.json();

        if (!serverData.data || !serverData.data.server) {
            return res.status(500).json({ error: "Failed to get GoFile server!" });
        }

        const server = serverData.data.server;
        const uploadUrl = `https://${server}.gofile.io/uploadFile`;

        // Upload File to GoFile
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        const resultText = await response.text(); // Get raw response
        let result;

        try {
            result = JSON.parse(resultText); // Try parsing as JSON
        } catch (e) {
            console.error("Invalid JSON response:", resultText);
            return res.status(500).json({ error: "Unexpected response from GoFile.io" });
        }

        if (!result.data || !result.data.downloadPage) {
            console.error("GoFile Error:", result);
            return res.status(500).json({ error: "Upload failed on GoFile.io!" });
        }

        // Store file reference
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
