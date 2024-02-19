const express = require('express');
const upload = require('../../multer');

// middlewre for valiadtion and errorHandler
const { asyncErrorHandler } = require('../middleware/error.middleware');

//middleware for download file
const downloadFileService = require('../middleware/download-file.middleware');

// metting stackholder controller 
const meetingStackholderController = require('../controllers/meeting-stackholders.controller');

// metting stackholder Services 
const meetingStackHolderServices = require('../services/meeting-stackholders.service');


const router = express.Router();


router.get('/' , asyncErrorHandler(meetingStackholderController.renderMeetingStackholders));
router.post('/insert', upload.fields([
    { name: 'rankingDocuments', maxCount: 5 },
    { name: 'accreditationFile', maxCount: 5 },
    { name: 'achievementsFile', maxCount: 5 },
    { name: 'convocationFile', maxCount: 5 },
    { name: 'inauguralProgramFile', maxCount: 5 },
    { name: 'eventFile', maxCount: 5 }
]),asyncErrorHandler(meetingStackholderController.insertMeetingStackholders));
router.post('/update', upload.fields([
    { name: 'rankingDocuments', maxCount: 5 },
    { name: 'accreditationFile', maxCount: 5 },
    { name: 'achievementsFile', maxCount: 5 },
    { name: 'convocationFile', maxCount: 5 },
    { name: 'inauguralProgramFile', maxCount: 5 },
    { name: 'eventFile', maxCount: 5 }
]),asyncErrorHandler(meetingStackholderController.updateMeetingStackholders));
router.post('/view' , asyncErrorHandler(meetingStackholderController.viewMeetingData));
router.post('/delete' , asyncErrorHandler(meetingStackholderController.deleteMeetingStackholders));
router.get('/download/:fileName', downloadFileService.downloadFile);
router.get('/viewing/:fileName', downloadFileService.viewFile);

module.exports = router;