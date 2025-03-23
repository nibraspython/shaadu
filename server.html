const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const uploadDir = path.join(__dirname, "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

app.use(express.static("public")); // Serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const botToken = req.body.bot_token;
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    let telegramWebhookUrl = "";

    if (botToken) {
        telegramWebhookUrl = `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(fileUrl)}`;
    }

    res.json({
        success: true,
        fileUrl,
        fileType: req.file.mimetype,
        telegramWebhookUrl
    });
});

module.exports = app;
