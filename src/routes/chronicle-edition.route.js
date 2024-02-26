const express = require('express');

const { asyncErrorHandler } = require('../middleware/error.middleware');
const chronicleController = require('../controllers/chronicle-edition.controller');

const router = express.Router();

router.get('/', chronicleController.renderChronicleEdition);
router.post('/vc-data/insert', asyncErrorHandler(chronicleController.insertVcData));
router.post('/research-data/insert', asyncErrorHandler(chronicleController.insertResearchData));
router.post('/meeting-data/insert', asyncErrorHandler(chronicleController.insertMeetingData));
router.post('/advertising-data/insert', asyncErrorHandler(chronicleController.insertBrandingData));

// for update
router.post('/vc-data/update', asyncErrorHandler(chronicleController.updateVcData));
router.post('/research-data/update', asyncErrorHandler(chronicleController.updateResearchData));
router.post('/meeting-data/update', asyncErrorHandler(chronicleController.updateMeetingData));
router.post('/advertising-data/update', asyncErrorHandler(chronicleController.updateBrandingData));




module.exports = router;