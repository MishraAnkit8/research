const express = require('express');
const upload = require('../../multer');


const { asyncErrorHandler } = require('../middleware/error.middleware');
const meetingStackholderController = require('../controllers/meeting-stackholders.controller');
const meetingStackHolderServices = require('../services/meeting-stackholders.service');


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
router.post('/view' , asyncErrorHandler(meetingStackholderController.viewMeetingData));
router.post('/delete' , asyncErrorHandler(meetingStackholderController.deleteMeetingStackholders));
router.get('/download/:fileName', meetingStackHolderServices.downloadFile);
router.get('/viewing/:fileName', meetingStackHolderServices.viewFile);

module.exports = router;