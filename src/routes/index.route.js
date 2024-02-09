const express = require('express');

const dashboardRoute = require('./dashboard.route');
const researchRoute = require('./research.route');
const teachingExecellanceRoute = require('./teaching-excellance.route');
const meetingStackholdersRoute = require('./meeting-stackholders.route');
const brandingAndAdvertisingRoute = require('./branding-advertising.route');
const chronicalRoutes = require('./chronical-edition.routes');

const router = express.Router();

router.use('/dashboard', dashboardRoute);
router.use('/research', researchRoute);
router.use('/teaching-excellance' , teachingExecellanceRoute);
router.use('/meeting-stackholders' , meetingStackholdersRoute);
router.use('/branding-advertising' , brandingAndAdvertisingRoute);
router.use('/chronical-edition' , chronicalRoutes);

module.exports = router;
