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

const meetingStackholderController = require('../controllers/meeting-stackholders.controller');
const { asyncErrorHandler } = require('../middleware/error.middleware');

const router = express.Router();
router.get('/' , asyncErrorHandler(meetingStackholderController.renderMeetingStackholders));

module.exports = router;