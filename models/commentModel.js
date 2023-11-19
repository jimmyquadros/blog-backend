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
        parent: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }],
        content: {
            type: String,
            required: true,
        },
        children: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }],
    },
    {
        timestamps: true,
    }
)

// if comment has a parent update the parent's child array
commentSchema.pre('save', async function(next) {
    this.populate('user')
    if (this.isNew) {
        const PostModel = mongoose.model('Post');
        await PostModel.findByIdAndUpdate(this.root, {$inc: {cmntCount: 1}});
    }
    if (!this.isNew || !this.parent) next();
    const CommentModel = mongoose.model('Comment');
    await CommentModel.findByIdAndUpdate(this.parent.at(-1),
        { "$push": { "children": this._id } })
    next();
})


commentSchema.pre('find', function (next) {
    console.log(this.children)
    this.populate({
        path: 'children',
        populate: {
            path: 'user'
        }
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
