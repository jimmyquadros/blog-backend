const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        root: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

commentSchema.virtual('children', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parent',
    justOne: false,
});

commentSchema.pre('find', function (next) {
    this.populate({
        path: 'children user',
    })
    next();
});

// Deletes any children on delete
commentSchema.pre('findOneAndDelete', async function(next) {
    try {
        const CommentModel = mongoose.model('Comment');
        const query = await CommentModel.find(this.getQuery());
        const document = query[0];
        let decCount = 1;
        if (document.children.length) {
            const del = await CommentModel.deleteMany({parent: document._id});
            decCount += del.deletedCount
        }
        const PostModel = mongoose.model('Post');
        const decpost = await PostModel.findByIdAndUpdate(document.root, {$inc: {cmntCount: -decCount}})
        next();
    } catch (err) {
        return next(err);
    }
})

module.exports = mongoose.model('Comment', commentSchema);
