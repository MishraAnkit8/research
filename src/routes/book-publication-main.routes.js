const express = require('express');
const upload = require('../../multer');

  

// middlewre for valiadtion and errorHandler
const { asyncErrorHandler } = require('../middleware/error.middleware');

//middleware for download file
const downloadFileService = require('../middleware/download-file.middleware');


const bookPublicationMainController = require('../controllers/book-publication-main.controller');

const bookPublicationService = require('../services/book-publication.service');
const bookPublicationController = require('../controllers/book-publication.controller');

const editedBookPublication = require('../controllers/edited-book.controller');
const editedBookService = require('../services/edited-book.service');

const bookChapterController = require('../controllers/book-chapter.controller');
const bookChapterServices = require('../services/book-chapter.service')


const router = express.Router();

// book publication main
router.get('/', asyncErrorHandler(bookPublicationMainController.renderBookPublication));

// book publication
router.get('/book-publication', asyncErrorHandler(bookPublicationController.renderBookPublication));
router.post('/book-publication/insert', upload.array('researchSupportingDocument' , 5), asyncErrorHandler(bookPublicationController.insertBookPublication), (req, res) => {
    const filePath = req.file.path;
    res.send(`File uploaded to 'uploads/bookPublication'. Path: ${filePath}`);
});
router.post('/book-publication/update',  upload.array('researchSupportingDocument', 5), asyncErrorHandler(bookPublicationController.updateBookPublication));
router.post('/book-publication/delete', asyncErrorHandler(bookPublicationController.deleteBookPublication));
router.post('/book-publication/view', asyncErrorHandler(bookPublicationController.viewBookPublication));
router.get('/book-publication/download/:fileName', downloadFileService.downloadFile);
router.get('/book-publication/viewing/:fileName', downloadFileService.viewFile);

//edited book publication

router.get('/edited-book-publication', asyncErrorHandler(editedBookPublication.renderEdietedBookPublication));
router.post('/edited-book-publication/insert',  upload.array('researchSupportingDocument', 5), asyncErrorHandler(editedBookPublication.insertEditedBookPublication));
router.post('/edited-book-publication/update',  upload.array('researchSupportingDocument', 5), asyncErrorHandler(editedBookPublication.updateEditedBookPublication));
router.post('/edited-book-publication/view',  asyncErrorHandler(editedBookPublication.viewEditedBookPublication));
router.post('/edited-book-publication/delete', asyncErrorHandler(editedBookPublication.deleteEditedBookPublication));
router.get('/edited-book-publication/download/:fileName', downloadFileService.downloadFile);
router.get('/edited-book-publication/viewing/:fileName', downloadFileService.viewFile);

//book chapter

router.get('/book-chapter-publication', asyncErrorHandler(bookChapterController.renderBookChapterPublication));
router.post('/book-chapter-publication/insert', upload.array('researchSupportingDocument' , 5), asyncErrorHandler(bookChapterController.insertBookChapterPublication));
router.post('/book-chapter-publication/update',  upload.array('researchSupportingDocument' , 5), asyncErrorHandler(bookChapterController.updateBookChapterData));
router.post('/book-chapter-publication/view',  asyncErrorHandler(bookChapterController.viewBookChapterData));
router.post('/book-chapter-publication/delete', asyncErrorHandler(bookChapterController.deleteBookChapterData));
router.get('/book-chapter-publication/download/:fileName', downloadFileService.downloadFile);
router.get('/book-chapter-publication/viewing/:fileName', downloadFileService.viewFile);


module.exports = router;
