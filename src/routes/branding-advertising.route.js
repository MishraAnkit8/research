const express = require('express');
const upload = require('../../multer');

const { asyncErrorHandler } = require('../middleware/error.middleware');
const brandingAndAdvertisingController = require('../controllers/branding-advertising.controller');
const brandingandAdvertisingServices = require('../services/branding-advertising.service');


const router = express.Router();

// branding and advertising
router.get('/' , asyncErrorHandler(brandingAndAdvertisingController.renderBrandingAndAdvertising));
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
]) , asyncErrorHandler(brandingAndAdvertisingController.insertBrandingAndAdvertising));

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
]), asyncErrorHandler(brandingAndAdvertisingController.updateBrandingAdvertising));

router.post('/view' , asyncErrorHandler(brandingAndAdvertisingController.viewBrandingadvertising));
router.post('/delete' , asyncErrorHandler(brandingAndAdvertisingController.deleteBrandingAdvertising));
router.get('/download/:fileName', brandingandAdvertisingServices.downloadFile);
router.get('/viewing/:fileName', brandingandAdvertisingServices.viewFile);





module.exports = router;