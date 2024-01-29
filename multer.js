const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

 // Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // destination folder
    },
    filename: function (req, file, cb) {

        console.log('file in multer ==>> ::::', file);
        // Define the filename as the original filename
        let uniqueFileName = uuidv4() + file.fieldname + '_' + file.originalname
        cb(null, uniqueFileName);
    }
});

const upload = multer({ storage: storage });

module.exports = upload