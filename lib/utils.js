const jwt = require('jsonwebtoken');

/** 
 * @param {*} user - user object 
 */
exports.generateAccessToken = (user) => {
    const accessToken = jwt.sign(
        {
            id: user._id,
            username: user.name,
            roles: user.roles
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '10s',
        }
    )
    return accessToken;
}

/** 
 * @param {*} user - user object 
 */
exports.generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
        {
            id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '1w',
        }
    )
    return refreshToken;
}

