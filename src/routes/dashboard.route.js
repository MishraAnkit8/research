const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { asyncErrorHandler } = require('../middleware/error.middleware');

const router = express.Router();

router.get('/', asyncErrorHandler(dashboardController.renderDashboard));

module.exports = router;