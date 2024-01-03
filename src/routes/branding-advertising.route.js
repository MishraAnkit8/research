const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const { asyncErrorHandler } = require('../middleware/error.middleware');
const brandingAndAdvertisingController = require('../controllers/branding-advertising.controller');

const router = express.Router();

// branding and advertising

router.get('/' , asyncErrorHandler(brandingAndAdvertisingController.renderBrandingAndAdvertising));
router.post('/insert', upload.fields([
    { name: 'facultyRecognitionDocuments', maxCount: 1 },
    { name: 'facultyAwardDocuments', maxCount: 1 },
    { name: 'staffAwardDocuments', maxCount: 1 },
    { name: 'alumniAwardDocuments', maxCount: 1 },
    { name: 'studentAwardDocuments', maxCount: 1 },
    { name: 'internationalLinkageDocuments', maxCount: 1 },
    { name: 'conferenceParticipationDocuments', maxCount: 1 },
    { name: 'organisingConferenceDocuments', maxCount: 1 },
    { name: 'studentEventParticipationDocuments', maxCount: 1 },
    { name: 'newspaperArticleDocuments', maxCount: 1 }
]) , asyncErrorHandler(brandingAndAdvertisingController.insertBrandingAndAdvertising));

router.post('/update', upload.fields([
    { name: 'facultyRecognitionDocuments', maxCount: 1 },
    { name: 'facultyAwardDocuments', maxCount: 1 },
    { name: 'staffAwardDocuments', maxCount: 1 },
    { name: 'alumniAwardDocuments', maxCount: 1 },
    { name: 'studentAwardDocuments', maxCount: 1 },
    { name: 'internationalLinkageDocuments', maxCount: 1 },
    { name: 'conferenceParticipationDocuments', maxCount: 1 },
    { name: 'organisingConferenceDocuments', maxCount: 1 },
    { name: 'studentEventParticipationDocuments', maxCount: 1 },
    { name: 'newspaperArticleDocuments', maxCount: 1 }
]), asyncErrorHandler(brandingAndAdvertisingController.updateBrandingAdvertising));

router.post('/view' , asyncErrorHandler(brandingAndAdvertisingController.viewBrandingadvertising));
router.post('/delete' , asyncErrorHandler(brandingAndAdvertisingController.deleteBrandingAdvertising));





module.exports = router;