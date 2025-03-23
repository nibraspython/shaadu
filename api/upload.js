const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = "/tmp"; // Required for Vercel
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error("Formidable error:", err);
            return res.status(500).json({ error: "Upload Failed" });
        }

        const file = files.file;
        if (!file || !file.filepath) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filename = file.originalFilename || `file_${Date.now()}`;
        const tempPath = file.filepath;
        const newPath = path.join("/tmp", filename);

        fs.rename(tempPath, newPath, (renameErr) => {
            if (renameErr) {
                console.error("File rename error:", renameErr);
                return res.status(500).json({ error: "File Rename Failed" });
            }

            const fileUrl = `https://${req.headers.host}/uploads/${filename}`;
            console.log("File uploaded successfully:", fileUrl);

            return res.json({ success: true, file_url: fileUrl });
        });
    });
};
