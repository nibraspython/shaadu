const multer = require("multer");
const express = require("express");

const app = express();
const upload = multer({ dest: "/tmp" }); // Temporary storage

app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, error: "No file uploaded" });
    }

    res.json({
        success: true,
        file_url: `https://shaadu.vercel.app/uploads/${req.file.filename}`,
        webhook_url: `https://api.telegram.org/bot${req.body.bot_token}/setWebhook?url=https://shaadu.vercel.app/uploads/${req.file.filename}`,
    });
});

module.exports = app;
