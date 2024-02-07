const express = require('express');
const upload = require('../../multer');

const teachingExecellanceController = require('../controllers/teaching-excellance.controller');
const teachingExecellanceServices = require('../services/teaching-excellance.service');

// middleware for server side validation and error handler
const { asyncErrorHandler } = require('../middleware/error.middleware');

const router = express.Router();

// teaching execellance
router.get('/', asyncErrorHandler(teachingExecellanceController.renderTeachingExecellance));
router.post('/insert', upload.fields([
    { name: 'pedagogyInnovationFile', maxCount: 5 },
    { name: 'fdpProgramFile', maxCount: 5 },
    { name: 'workShopFile', maxCount: 5 },
    { name: 'invitingFacultyFile', maxCount: 5 },
    { name: 'programOrientationFile', maxCount: 5 }
]),asyncErrorHandler(teachingExecellanceController.insertTeachingExecellance));
router.post('/update', upload.fields([
    { name: 'pedagogyInnovationFile', maxCount: 5 },
    { name: 'fdpProgramFile', maxCount: 5 },
    { name: 'workShopFile', maxCount: 5 },
    { name: 'invitingFacultyFile', maxCount: 5 },
    { name: 'programOrientationFile', maxCount: 5 }
]),asyncErrorHandler(teachingExecellanceController.updatTeachingData));
router.post('/delete', asyncErrorHandler(teachingExecellanceController.deleteTeachingExecellance));
router.post('/view', asyncErrorHandler(teachingExecellanceController.viewTeachingExecellance));
router.get('/download/:fileName', teachingExecellanceServices.downloadFile);
router.get('/viewing/:fileName', teachingExecellanceServices.viewFile);

module.exports = router;