const express = require('express');
const multer = require('multer');

 // Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const meetingStackholderController = require('../controllers/meeting-stackholders.controller');
const { asyncErrorHandler } = require('../middleware/error.middleware');
const router = express.Router();
router.get('/' , asyncErrorHandler(meetingStackholderController.renderMeetingStackholders));
router.post('/insert', upload.fields([
    { name: 'rankingDocuments', maxCount: 1 },
    { name: 'accreditationFile', maxCount: 1 },
    { name: 'achievementsFile', maxCount: 1 },
    { name: 'convocationFile', maxCount: 1 },
    { name: 'inauguralProgramFile', maxCount: 1 },
    { name: 'eventFile', maxCount: 1 }
]),asyncErrorHandler(meetingStackholderController.insertMeetingStackholders));
router.post('/update', upload.fields([
    { name: 'rankingDocuments', maxCount: 1 },
    { name: 'accreditationFile', maxCount: 1 },
    { name: 'achievementsFile', maxCount: 1 },
    { name: 'convocationFile', maxCount: 1 },
    { name: 'inauguralProgramFile', maxCount: 1 },
    { name: 'eventFile', maxCount: 1 }
]),asyncErrorHandler(meetingStackholderController.updateMeetingStackholders));

module.exports = router;