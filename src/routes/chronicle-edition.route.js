const express = require('express');

const { asyncErrorHandler } = require('../middleware/error.middleware');
const chronicleController = require('../controllers/chronicle-edition.controller');

//logger file middle ware
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

//for render page
router.get('/', chronicleController.renderChronicleEdition);

//for inserting data route
router.post('/submit-vc-data/insert', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.insertVcData));
router.post('/submit-research-data/insert', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.insertResearchData));
router.post('/submit-meeting-stackholders-data/insert', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.insertMeetingData));
router.post('/submit-advertising-data/insert', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.insertBrandingData));

// for update
router.post('/update-vc-data/update', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.updateVcData));
router.post('/update-research-data/update', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.updateResearchData));
router.post('/update-meeting-stackholders-data/update', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.updateMeetingData));
router.post('/update-advertising-data/update', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.updateBrandingData));

//for delete 
router.post('/vcData/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.deleteVcData));
router.post('/Research/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.deleteResearchData));
router.post('/meetingData/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.deleteMeetingData));
router.post('/Branding/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(chronicleController.deleteBrandingData));





module.exports = router;