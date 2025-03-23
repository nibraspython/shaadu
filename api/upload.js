const { parse } = require("formidable");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const form = new (require("formidable").IncomingForm)();
    form.uploadDir = "/tmp"; // Vercel allows only /tmp for file storage
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: "Upload Failed" });
        }

        const file = files.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filename = path.basename(file.filepath);
        const fileUrl = `https://${req.headers.host}/uploads/${filename}`;

        return res.json({ success: true, file_url: fileUrl });
    });
};
