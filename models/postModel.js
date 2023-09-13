const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        draft: {
            type: String,
        },
        pub: {
            type: String,
        },
        pubDate: {
            type: Date,
        },
        cmntCount: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

postSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (!update.pub) return next();
    update.pubDate = Date.now();
    next();
})

postSchema.pre('save', function(next) {
    if (!this.isNew) return next();
    if (!this.pub) return next();
    this.pubDate = Date.now();
    next();
})

postSchema.pre('findOneAndDelete', async function(next) {
    await mongoose.model('Comment').deleteMany({root: this.getQuery()._id});
    next();
})

module.exports = mongoose.model('Post', postSchema);