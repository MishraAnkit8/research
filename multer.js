const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // destination folder
    },
    filename: function (req, file, cb) {
        // Append a unique identifier (UUID) to the original filename
        // let uniqueFileName = uuidv4() + '_' + file.originalname;
        let uniqueFileName = file.originalname;
        console.log('uniqueFileName ====>>>>>>>', uniqueFileName);
        cb(null, uniqueFileName);
    }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
