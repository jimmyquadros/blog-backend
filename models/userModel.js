const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        roles: {
            type: Array,
            default: [5000],
        },
        refreshToken: String,
    }
)

userSchema.pre(
    'save',
    async function(next) {
        const user = this;
        if (!user.isModified('password')) return next();

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);

        user.password = hash;
        return next();
    }
)

userSchema.pre(
    'findOneAndUpdate',
    async function(next) {
        const user = this;
        const update = user.getUpdate();
        if(update.password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(update.password, salt);
            user.password = hash;
        }
        return next();
    }
)

userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

module.exports = mongoose.model('User', userSchema);