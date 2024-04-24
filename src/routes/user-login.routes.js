const express = require('express');
const userRegistrationController = require('../controllers/user-login-controller');
const { asyncErrorHandler } = require('../middleware/error.middleware');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', asyncErrorHandler(userRegistrationController.renderLoginPage));
router.post('/login' , asyncErrorHandler(userRegistrationController.userLoginSession));

//logout
router.get('/logout', asyncErrorHandler(userRegistrationController.userLogoutSession));

module.exports = router;