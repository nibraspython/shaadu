const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const port = process.env.PORT || 3000;

// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static("public")); // Serve static files

// HTML Upload Page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Handle File Upload & Store Temporarily
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
        // Upload file to file.io (Temporary Storage)
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        const response = await fetch("https://file.io", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!result.success) {
            return res.status(500).json({ error: "File upload failed!" });
        }

        res.json({
            success: true,
            file_url: result.link, // Temporary file link
            file_name: req.file.originalname,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed. Try again!" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
