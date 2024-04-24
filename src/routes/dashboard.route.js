const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { asyncErrorHandler } = require('../middleware/error.middleware');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', asyncErrorHandler(authMiddleware), asyncErrorHandler(dashboardController.renderDashboard));

module.exports = router;