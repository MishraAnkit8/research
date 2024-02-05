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
    { name: 'pedagogyInnovationFile', maxCount: 1 },
    { name: 'fdpProgramFile', maxCount: 1 },
    { name: 'workShopFile', maxCount: 1 },
    { name: 'invitingFacultyFile', maxCount: 1 },
    { name: 'programOrientationFile', maxCount: 1 }
]),asyncErrorHandler(teachingExecellanceController.insertTeachingExecellance));
router.post('/update', upload.fields([
    { name: 'pedagogyInnovationFile', maxCount: 1 },
    { name: 'fdpProgramFile', maxCount: 1 },
    { name: 'workShopFile', maxCount: 1 },
    { name: 'invitingFacultyFile', maxCount: 1 },
    { name: 'programOrientationFile', maxCount: 1 }
]),asyncErrorHandler(teachingExecellanceController.updatTeachingData));
router.post('/delete', asyncErrorHandler(teachingExecellanceController.deleteTeachingExecellance));
router.post('/view', asyncErrorHandler(teachingExecellanceController.viewTeachingExecellance));
router.get('/download/:fileName', teachingExecellanceServices.downloadFile);
router.get('/viewing/:fileName', teachingExecellanceServices.viewFile);

module.exports = router;