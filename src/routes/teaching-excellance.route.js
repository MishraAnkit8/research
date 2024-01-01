const express = require('express');
const multer = require('multer');

 // Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // destination folder
    },
    filename: function (req, file, cb) {
        // Define the filename as the original filename
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const teachingExecellanceController = require('../controllers/teaching-excellance.controller');
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

module.exports = router;