const multer = require('multer');

 // Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // destination folder
    },
    filename: function (req, file, cb) {
        // Define the filename as the original filename
        let uniqueFileName = file.originalname +'_'+ UUID();
        cb(null, uniqueFileName);
    }
});

const upload = multer({ storage: storage });

module.exports = upload