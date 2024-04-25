const express = require('express');
const upload = require('../../multer');

// middlewre for valiadtion and errorHandler
const { asyncErrorHandler } = require('../middleware/error.middleware');

//middleware for download file
const downloadFileService = require('../middleware/download-file.middleware');

//logger file middle ware
const { authMiddleware } = require('../middleware/authMiddleware');

//branding advertising controller
const brandingAndAdvertisingController = require('../controllers/branding-advertising.controller');

//branding advertising service
const brandingandAdvertisingServices = require('../services/branding-advertising.service');


const router = express.Router();

// branding and advertising
router.get('/' , asyncErrorHandler(authMiddleware), asyncErrorHandler(brandingAndAdvertisingController.renderBrandingAndAdvertising));
router.post('/insert', upload.fields([
    { name: 'facultyRecognitionDocuments', maxCount: 5 },
    { name: 'facultyAwardDocuments', maxCount: 5 },
    { name: 'staffAwardDocuments', maxCount: 5 },
    { name: 'alumniAwardDocuments', maxCount: 5 },
    { name: 'studentAwardDocuments', maxCount: 5 },
    { name: 'internationalLinkageDocuments', maxCount: 5 },
    { name: 'conferenceParticipationDocuments', maxCount: 5 },
    { name: 'organisingConferenceDocuments', maxCount: 5 },
    { name: 'studentEventParticipationDocuments', maxCount: 5 },
    { name: 'newspaperArticleDocuments', maxCount: 5 }
]) , asyncErrorHandler(authMiddleware), asyncErrorHandler(brandingAndAdvertisingController.insertBrandingAndAdvertising));

router.post('/update', upload.fields([
    { name: 'facultyRecognitionDocuments', maxCount: 5 },
    { name: 'facultyAwardDocuments', maxCount: 5 },
    { name: 'staffAwardDocuments', maxCount: 5 },
    { name: 'alumniAwardDocuments', maxCount: 5 },
    { name: 'studentAwardDocuments', maxCount: 5 },
    { name: 'internationalLinkageDocuments', maxCount: 5 },
    { name: 'conferenceParticipationDocuments', maxCount: 5 },
    { name: 'organisingConferenceDocuments', maxCount: 5 },
    { name: 'studentEventParticipationDocuments', maxCount: 5 },
    { name: 'newspaperArticleDocuments', maxCount: 5 }
]), asyncErrorHandler(authMiddleware), asyncErrorHandler(brandingAndAdvertisingController.updateBrandingAdvertising));

router.post('/view' , asyncErrorHandler(authMiddleware), asyncErrorHandler(brandingAndAdvertisingController.viewBrandingadvertising));
router.post('/delete' , asyncErrorHandler(authMiddleware), asyncErrorHandler(brandingAndAdvertisingController.deleteBrandingAdvertising));
router.get('/download/:fileName', downloadFileService.downloadFile);
router.get('/viewing/:fileName', downloadFileService.viewFile);





module.exports = router;