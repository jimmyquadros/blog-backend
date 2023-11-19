const asyncHandler = require('express-async-handler');
const passport = require('passport');
const {generateAccessToken, generateRefreshToken} = require('../lib/utils');
const User = require('mongoose').model('User');

// Testing!
exports.getError = (req, res, next) => {
    res.status(418);
    return next(new Error(["I'm a little teapot!", "Another Error!", "Third Error"]));
}

// @desc    create new user
// @route   POST /user/
// @access  public
exports.createUser = asyncHandler(async (req, res, next) => {
    passport.authenticate('signup', {badRequestMessage: 'Requires valid email and password'}, function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.status(400);
            return next(new Error(info.message));
        }
        req.login(
            user,
            {session: false},
            async (error) => {
                if (error) return next(error);
                res.json({
                    message: 'User created successfully',
                });
            }
        )
    })(req, res, next);
});

// @desc    update user with associated id
// @route   PUT /user/:id
// @access  User
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const { name, password } = req.body;

    if (name) user.name = name;
    if (password) user.password = password;
    const result = await user.save();

    const accessToken = generateAccessToken(user);
    res.json({token: accessToken})
})

// @desc    logs in user
// @route   POST /user/login
// @access  public
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('Username and password required')
    passport.authenticate(
        'login',
        (err, user, info) => {
            if (err) {
                res.status(500);
                return next(err);
            }
            if (!user) {
                res.status(401);
                return next(new Error(info.message));
            }
            req.login(
                user,
                {session: false},
                async (error) => {
                    if (error) return next(error);
                    const accessToken = generateAccessToken(user);
                    const refreshToken = generateRefreshToken(user);
                    user.refreshToken = refreshToken;
                    const result = await user.save();
                    res.cookie('jwt', refreshToken, {httpOnly: true, secure: true, sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000});
                    res.json({token: accessToken});
                }
            )
        }
    )(req, res, next);
});

// @desc    logs out user
// @route   GET /user/logout
// @access  public
exports.logoutUser = asyncHandler(async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken}).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
})