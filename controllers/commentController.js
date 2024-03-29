const asyncHandler = require('express-async-handler');
const Comment = require('mongoose').model('Comment');
const Post = require('mongoose').model('Post');

// @desc    get comment by id
// @route   GET /comment/:id/
// @access  public
exports.getComments = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    try {
        const comments = await Comment.find(
            {
                _id: id,
            }
        )
        res.json(comments);
    } catch (err) {
        res.status(401);
        return next(err);
    }
});

exports.postDelay = asyncHandler(async (req, res, next) => {
    setTimeout(async () => {
        const comment = {
            user: req.user.id,
            ...req.body
        };
        try {
            let newComment = await Comment.create(comment);
            let popComment = await Comment.find({_id: newComment._id});
            await Post.findOneAndUpdate({_id: req.body.root}, {$inc: {'cmntCount' : 1}});
            res.json(popComment);
        } catch(err) {
            res.status(401);
            return next(err);
        }
    }, 3000);
})

// @desc    create a comment associated with root post id
// @route   POST /comment/
// @access  User
exports.postComment = asyncHandler(async (req, res, next) => {
    const comment = {
        user: req.user.id,
        ...req.body
    };
    try {
        let newComment = await Comment.create(comment);
        let popComment = await Comment.find({_id: newComment._id});
        await Post.findOneAndUpdate({_id: req.body.root}, {$inc: {'cmntCount' : 1}});
        res.json(popComment);
    } catch(err) {
        res.status(401);
        return next(err);
    }
});

// @desc    updates existing comment (id)
// @route   PUT /comment/:id
// @access  User
exports.updateComment = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    try {
        const comment = await Comment.findById(id);
        if ((!req.user.roles.includes(9000) && comment.user.toString() !== req.user.id)) {
            res.status(401);
            return next(new Error('User not authenticated to modify post'));
        }
        Object.assign(comment, req.body);
        if (req.body.user === false) {
            comment.user = undefined;
        }
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(401);
        return next(err);
    }
});

// @desc    deletes comment with id
// @route   DELETE /comment/:id
// @access  Admin
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    try {
        await Comment.findByIdAndDelete(id);
        res.json({message: 'comment successfully deleted'});
    } catch (err) {
        res.status(401);
        return next(err);
    }
});
