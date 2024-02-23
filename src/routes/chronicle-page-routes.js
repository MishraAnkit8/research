const express = require('express');

const { asyncErrorHandler } = require('../middleware/error.middleware');
const chroniclePageController = require('../controllers/chronicle-edition-page.controller');

const router = express.Router();

router.get("/textdata/:textdata/id/:id", chroniclePageController.renderChronicleEditionPage);
// router.get("/textdata/:textdata/id/:id", chroniclePageController.renderChronicleEditionPage);
// router.get("/textdata/:textdata/id/:id", chroniclePageController.renderChronicleEditionPage);
// router.get("/textdata/:textdata/id/:id", chroniclePageController.renderChronicleEditionPage);






module.exports = router;