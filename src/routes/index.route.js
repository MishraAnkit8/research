const express = require('express');

const dashboardRoute = require('./dashboard.route');
const researchRoute = require('./research.route');
const teachingExecellanceRoute = require('./teaching-excellance.route');

const router = express.Router();

router.use('/dashboard', dashboardRoute);
router.use('/research', researchRoute);
router.use('/teaching-excellance' , teachingExecellanceRoute);

module.exports = router;
