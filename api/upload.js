const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const router = express.Router();

// Memory storage (no local file system issues)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        // Upload to goFile.io
        const serverResponse = await fetch("https://api.gofile.io/getServer");
        const { data } = await serverResponse.json();
        const server = data.server;

        const uploadResponse = await fetch(`https://${server}.gofile.io/uploadFile`, {
            method: "POST",
            body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.data || !uploadResult.data.downloadPage) {
            return res.status(500).json({ error: "Upload failed!" });
        }

        res.json({
            success: true,
            file_url: uploadResult.data.downloadPage,
            file_name: req.file.originalname,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed. Try again!" });
    }
});

app.use("/api/upload", router);

module.exports = app;
