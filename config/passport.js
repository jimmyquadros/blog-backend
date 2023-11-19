const localStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const AnonymousStrategy = require('passport-anonymous').Strategy;
const mongoose = require('mongoose');
const User = require('mongoose').model('User');

const signupStrategy = new localStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        const { name } = req.body;
        try {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return done(null, false, { message: 'email already registered' });
            }

            const user = User.create({
                email,
                name,
                password,
            });

            return done(null, user);
        } catch (err) {
            done(err);
        }
    }
);

const loginStrategy = new localStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        const user = await mongoose.model('User').findOne({email});
        if (!user) {
            return done(null, false, { message: 'User Not Found' });
        }
        const valid = await user.isValidPassword(password);
        if (!valid) {
            return done(null, false, { message: 'Invalid Password'});
        }
        return done(null, user);
    }
)

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

const jwtUserStrategy = new JwtStrategy(
    options,
    async (payload, done) => {
        try {
            const user = await User.findById(payload.id).exec();
            if (!user) {
                return done(null, false, { message: 'user not found' })
            };
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
)

const jwtAdminStrategy = new JwtStrategy(
    options,
    async (payload, done) => {
        console.log('doing the check')
        try {
            const user = await User.findById(payload.id).exec();
            if (!user) {
                console.log('fail one')
                return done(null, false, { message: 'user not found' });
            };
            
            if (user.roles.includes(9000) || user.roles.includes(1000)) {
                console.log('success')
                return done(null, user);
            }
            return done(null, false, { message: 'user not authorized' });
        } catch (err) {
            return done(err, null);
        }
    }
)

module.exports = (passport) => {
    passport.use('signup', signupStrategy);
    passport.use('login', loginStrategy);
    passport.use('jwtUser', jwtUserStrategy);
    passport.use('jwtAdmin', jwtAdminStrategy);
    passport.use(new AnonymousStrategy());
}