const express = require('express');
const upload = require('../../multer');

const teachingExecellanceController = require('../controllers/teaching-excellance.controller');

// middleware for server side validation and error handler
const { asyncErrorHandler } = require('../middleware/error.middleware');
const {validateOrg} = require('../middleware/data-validation');

const router = express.Router();

// teaching execellance
router.get('/', asyncErrorHandler(teachingExecellanceController.renderTeachingExecellance));
router.post('/insert', validateOrg, upload.fields([
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

module.exports = router;