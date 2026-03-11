const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        // Clean filename to avoid issues
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, 'img-' + Date.now() + '-' + cleanName);
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only (jpeg, jpg, png, gif, webp, svg)!');
    }
}

router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ success: false, message: 'No file selected!' });
            } else {
                // Construct URL
                // Note: The frontend needs to access this.
                // We will return a relative path or full URL.
                // It's often safer to return the relative path '/uploads/filename'
                // and let the frontend or browser handle the host.
                // Assuming server serves '/uploads' statically.

                const filePath = `/uploads/${req.file.filename}`;

                res.status(200).json({
                    success: true,
                    message: 'Image uploaded!',
                    filePath: filePath
                });
            }
        }
    });
});

module.exports = router;
