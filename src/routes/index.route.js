const express = require('express');

const dashboardRoute = require('./dashboard.route');
const researchRoute = require('./research.route');
const teachingExecellanceRoute = require('./teaching-excellance.route');
const meetingStackholdersRoute = require('./meeting-stackholders.route');
const brandingAndAdvertisingRoute = require('./branding-advertising.route');
const chronicleRoutes = require('./chronicle-edition.route');
const chroniclePageRoutes = require('./chronicle-page-routes');

const router = express.Router();

router.use('/dashboard', dashboardRoute);
router.use('/research', researchRoute);
router.use('/teaching-excellance' , teachingExecellanceRoute);
router.use('/meeting-stackholders' , meetingStackholdersRoute);
router.use('/branding-advertising' , brandingAndAdvertisingRoute);
router.use('/chronicle-edition' , chronicleRoutes);
router.use('/chronicle-page' , chroniclePageRoutes);

module.exports = router;
