const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Serve static files (for uploaded files)
app.use("/uploads", express.static(uploadDir));

// Main HTML form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    const botToken = req.body.bot_token;
    const filePath = `/uploads/${req.file.filename}`;
    const webhookUrl = botToken
        ? `https://api.telegram.org/bot${botToken}/setWebhook?url=${req.protocol}://${req.get("host")}${filePath}`
        : null;

    res.json({
        success: true,
        message: "File uploaded successfully!",
        file_url: filePath,
        file_type: req.file.mimetype,
        webhook_url: webhookUrl,
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
