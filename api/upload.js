const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const os = require("os");

module.exports = (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = os.tmpdir(); // Temporary folder
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({ success: false, error: "File upload error" });
        }

        const file = files.file;
        if (!file) {
            return res.status(400).json({ success: false, error: "No file uploaded" });
        }

        const fileName = file.originalFilename.replace(/\s+/g, "_");
        const tempPath = file.filepath;
        const newFilePath = path.join(os.tmpdir(), fileName);

        fs.rename(tempPath, newFilePath, (err) => {
            if (err) {
                return res.status(500).json({ success: false, error: "File save error" });
            }

            const fileUrl = `https://${req.headers.host}/uploads/${fileName}`;
            res.json({ success: true, file_url: fileUrl, file_name: fileName });
        });
    });
};
