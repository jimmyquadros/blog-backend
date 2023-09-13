const {body, validationResult} = require('express-validator');

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

exports.validateNewUser = [
    body('email', 'Must include valid email address')
        .trim()
        .notEmpty()
        .bail()
        .isEmail(),
    body('password', 'Password must be 8-24 mixed case characters at least one number and special character')
        .notEmpty()
        .bail()
        .isLength({ min: 8, max: 24 })
        .bail()
        .matches(PWD_REGEX),
    body('name', 'Username must be 3-24 characters and be alphanumeric')
        .trim()
        .notEmpty()
        .bail()
        .isLength({ min: 3, max: 24 })
        .bail()
        .matches(USER_REGEX)
        .escape(),
    (req, res, next) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            res.status(400);
            throw new Error(err.array().map(e => e.msg));
        }
        return next();
    }
]