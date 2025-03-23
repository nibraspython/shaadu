const multer = require("multer");
const upload = multer({ dest: "/tmp" }); // Temporary storage

module.exports = (req, res) => {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

    upload.single("file")(req, res, (err) => {
        if (err) return res.status(500).json({ message: "Upload failed." });

        res.json({ message: "File uploaded successfully!" });
    });
};
