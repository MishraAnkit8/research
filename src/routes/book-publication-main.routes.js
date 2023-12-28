const express = require('express');
const multer = require('multer');


const { asyncErrorHandler } = require('../middleware/error.middleware');
const bookPublicationMainController = require('../controllers/book-publication-main.controller');
const bookPublicationController = require('../controllers/book-publication.controller');
const editedBookPublication = require('../controllers/edited-book.controller');

 // Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // destination folder
    },
    filename: function (req, file, cb) {
        // Define the filename as the original filename
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
const router = express.Router();

// book publication main
router.get('/', asyncErrorHandler(bookPublicationMainController.renderBookPublication));

// book publication
router.get('/book-publication', asyncErrorHandler(bookPublicationController.renderBookPublication));

//edited book
router.get('/edited-book-publication', asyncErrorHandler(editedBookPublication.renderEditedBook));
router.post('/edited-book-publication/insert',  upload.single('researchSupportingDocument'), asyncErrorHandler(bookPublicationController.insertBookPublication))

module.exports = router;
