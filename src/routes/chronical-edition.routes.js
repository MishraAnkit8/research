const express = require('express');

const chronicalController = require('../controllers/chronical-edition-controller');

const router = express.Router();

router.get('/' , chronicalController.renderChronicalEdition);

module.exports = router;