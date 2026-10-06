const multer = require("multer");


/**
 * @description Stores uploaded files in memory.
 */
const storage =
    multer.memoryStorage();


/**
 * @description Accepts PDF files only.
 */
const fileFilter =
    (req, file, cb) => {

        if (
            file.mimetype ===
            "application/pdf"
        ) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only PDF files are allowed"
                ),
                false
            );
        }
    };


/**
 * @description Multer upload middleware.
 */
const upload =
    multer({
        storage,

        fileFilter,

        limits: {
            fileSize:
                3 * 1024 * 1024
        }
    });


module.exports = upload;