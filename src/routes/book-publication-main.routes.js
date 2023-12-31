const express = require('express');
const multer = require('multer');


const { asyncErrorHandler } = require('../middleware/error.middleware');
const bookPublicationMainController = require('../controllers/book-publication-main.controller');
const bookPublicationController = require('../controllers/book-publication.controller');
const editedBookPublication = require('../controllers/edited-book.controller');
const bookChapterController = require('../controllers/book-chapter.controller')

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
router.post('/book-publication/insert',  upload.single('researchSupportingDocument'), asyncErrorHandler(bookPublicationController.insertBookPublication));
router.post('/book-publication/update',  upload.single('researchSupportingDocument'), asyncErrorHandler(bookPublicationController.updateBookPublication));
router.post('/book-publication/delete', asyncErrorHandler(bookPublicationController.deleteBookPublication));
router.post('/book-publication/view', asyncErrorHandler(bookPublicationController.viewBookPublication));

//edited book publication

router.get('/edited-book-publication', asyncErrorHandler(editedBookPublication.renderEdietedBookPublication));
router.post('/edited-book-publication/insert',  upload.single('researchSupportingDocument'), asyncErrorHandler(editedBookPublication.insertEditedBookPublication));
router.post('/edited-book-publication/update',  upload.single('researchSupportingDocument'), asyncErrorHandler(editedBookPublication.updateEditedBookPublication));
router.post('/edited-book-publication/view',  asyncErrorHandler(editedBookPublication.viewEditedBookPublication));
router.post('/edited-book-publication/delete', asyncErrorHandler(editedBookPublication.deleteEditedBookPublication));

//book chapter

router.get('/book-chapter-publication', asyncErrorHandler(bookChapterController.renderEdietedBookPublication));
router.post('/book-chapter-publication/insert',  upload.single('researchSupportingDocument'), asyncErrorHandler(bookChapterController.insertEditedBookPublication));
router.post('/book-chapter-publication/update',  upload.single('researchSupportingDocument'), asyncErrorHandler(bookChapterController.updateEditedBookPublication));
router.post('/book-chapter-publication/view',  asyncErrorHandler(bookChapterController.viewEditedBookPublication));
router.post('/book-chapter-publication/delete', asyncErrorHandler(bookChapterController.deleteEditedBookPublication));


module.exports = router;
