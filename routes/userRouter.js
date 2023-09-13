const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validator = require('../middleware/validationMiddleware');
const passport = require('passport');
const refreshTokenController = require('../controllers/refreshTokenController');

const ExtractJwt = require('passport-jwt').ExtractJwt;


// Test routes -DELETE
router.get('/', passport.authenticate('jwtUser', { session: false }), (req, res, next) => res.json({ message: 'bingo' }))
router.get('/admin', passport.authenticate('jwtAdmin', { session: false }), (req, res, next) => res.json({ message: 'bingo admin' }))

router.post('/', validator.validateNewUser, userController.createUser);
router.put('/', passport.authenticate('jwtUser', { session: false }), userController.updateUser)
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.get('/refresh', refreshTokenController.handleRefreshToken);

module.exports = router;