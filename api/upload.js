const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Store uploaded file URLs
const fileDatabase = {};

router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // Upload to GoFile
        const serverRes = await fetch("https://api.gofile.io/getServer");
        const { data } = await serverRes.json();
        const gofileServer = data.server;

        const uploadRes = await fetch(`https://${gofileServer}.gofile.io/upload`, {
            method: "POST",
            body: formData,
        });

        const uploadResult = await uploadRes.json();

        if (!uploadResult.data || !uploadResult.data.downloadPage) {
            console.error("GoFile Upload Error:", uploadResult);
            return res.status(500).json({ error: "Upload failed on GoFile!" });
        }

        const fileUrl = uploadResult.data.downloadPage;
        const filename = req.file.originalname;

        // Save filename + URL in memory (or DB)
        fileDatabase[filename] = fileUrl;

        res.json({
            success: true,
            file_url: `https://shaadu.vercel.app/uploads/${filename}`, // Custom URL
            original_url: fileUrl, // Actual download link
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed. Try again!" });
    }
});

// Serve the file via custom URL
router.get("/:filename", (req, res) => {
    const filename = req.params.filename;

    if (fileDatabase[filename]) {
        return res.redirect(fileDatabase[filename]); // Redirect to actual file
    } else {
        return res.status(404).json({ error: "File not found!" });
    }
});

app.use("/api/upload", router);
app.use("/uploads", router);

module.exports = app;
