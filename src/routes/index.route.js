const express = require('express');

const dashboardRoute = require('./dashboard.route');
const researchRoute = require('./research.route');

const router = express.Router();

router.use('/dashboard', dashboardRoute);
router.use('/research', researchRoute);

module.exports = router;
