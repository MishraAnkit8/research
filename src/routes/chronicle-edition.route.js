const express = require('express');

const chronicleController = require('../controllers/chronicle-edition.controller');

const router = express.Router();

router.get('/' , chronicleController.renderChronicleEdition);
router.post('/insert' , chronicleController.insertChronicleEdition);

module.exports = router;