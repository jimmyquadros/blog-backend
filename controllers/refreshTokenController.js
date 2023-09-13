const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../lib/utils')

// @desc    validates refresh token, returns credentials/new token
// @route   GET user/refresh
// @access  public
const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.status(401);
        return next(new Error("Invalid User"))
    }
    let refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.status(403);
        return next(new Error("Forbidden"));
    }

    // refreshToken = refreshToken.split(' ')[1];

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.id !== decoded.id) {
                res.status(403)
                return next(new Error("Unauthorized"));
            }
            const roles = Object.values(foundUser.roles);
            const accessToken = generateAccessToken(foundUser);
            res.json({ username: foundUser.name, roles, accessToken })
        }
    )
}

module.exports = { handleRefreshToken };