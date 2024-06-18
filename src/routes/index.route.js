const express = require('express');

const dashboardRoute = require('./dashboard.route');
const researchRoute = require('./research.route');
const teachingExecellanceRoute = require('./teaching-excellance.route');
const meetingStackholdersRoute = require('./meeting-stackholders.route');
const brandingAndAdvertisingRoute = require('./branding-advertising.route');
const chronicleRoutes = require('./chronicle-edition.route');
const chroniclePageRoutes = require('./chronicle-page-routes');
const userRegistrationRoutes = require('./user-login.routes');
const { asyncErrorHandler } = require('../middleware/error.middleware');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use('/dashboard-page',asyncErrorHandler(authMiddleware), dashboardRoute);
router.use('/research', asyncErrorHandler(authMiddleware), researchRoute);
router.use('/teaching-excellance' ,  asyncErrorHandler(authMiddleware), teachingExecellanceRoute);
router.use('/meeting-stackholders' , asyncErrorHandler(authMiddleware),  meetingStackholdersRoute);
router.use('/brandingAdvertising' , asyncErrorHandler(authMiddleware), brandingAndAdvertisingRoute);
router.use('/chronicle-edition' , asyncErrorHandler(authMiddleware), chronicleRoutes);
router.use('/chronicle-page' ,  asyncErrorHandler(authMiddleware), chroniclePageRoutes);
router.use('/user' , userRegistrationRoutes);

module.exports = router;
