const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validator = require('../middleware/validationMiddleware');
const passport = require('passport');
const refreshTokenController = require('../controllers/refreshTokenController');
const ExtractJwt = require('passport-jwt').ExtractJwt;

router.post('/', validator.validateNewUser, userController.createUser);
// router.post('/', validator.validateNewUser, userController.getError);
// router.put('/', passport.authenticate('jwtUser', { session: false }), userController.updateUser)
router.put('/', passport.authenticate('jwtUser', { session: false }), userController.getError)
router.post('/login', userController.loginUser);
// router.post('/login', userController.getError);
router.get('/logout', userController.logoutUser);
router.get('/refresh', refreshTokenController.handleRefreshToken);

module.exports = router;