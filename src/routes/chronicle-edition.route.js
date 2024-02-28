const express = require('express');

const { asyncErrorHandler } = require('../middleware/error.middleware');
const chronicleController = require('../controllers/chronicle-edition.controller');

const router = express.Router();

//for render page
router.get('/', chronicleController.renderChronicleEdition);

//for inserting data route
router.post('/submit-vc-data/insert', asyncErrorHandler(chronicleController.insertVcData));
router.post('/submit-research-data/insert', asyncErrorHandler(chronicleController.insertResearchData));
router.post('/submit-meeting-stackholders-data/insert', asyncErrorHandler(chronicleController.insertMeetingData));
router.post('/submit-advertising-data/insert', asyncErrorHandler(chronicleController.insertBrandingData));

// for update
router.post('/update-vc-data/update', asyncErrorHandler(chronicleController.updateVcData));
router.post('/update-research-data/update', asyncErrorHandler(chronicleController.updateResearchData));
router.post('/update-meeting-stackholders-data/update', asyncErrorHandler(chronicleController.updateMeetingData));
router.post('/update-advertising-data/update', asyncErrorHandler(chronicleController.updateBrandingData));

//for delete 
router.post('/vcData/delete', asyncErrorHandler(chronicleController.deleteVcData));
router.post('/Research/delete', asyncErrorHandler(chronicleController.deleteResearchData));
router.post('/meetingData/delete', asyncErrorHandler(chronicleController.deleteMeetingData));
router.post('/Branding/delete', asyncErrorHandler(chronicleController.deleteBrandingData));





module.exports = router;