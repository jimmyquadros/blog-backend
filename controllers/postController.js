const asyncHandler = require('express-async-handler');
const Post = require('mongoose').model('Post');
const ObjectId = require('mongoose').Types.ObjectId;

// @desc    gets a single post with associated id
// @route   GET /post/:id
// @access  public
exports.getPost = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.status(400);
        return next(new Error('Invalid request'));
    }
    const post = await Post.findById(req.params.id).populate('user', 'name -_id').exec();
    if (!post) {
        res.status(400);
        return next(new Error('Invalid request'));
    }
    if (!post.pub && (!req.user.roles.includes(9000))) {
        res.status(401);
        return next(new Error('Unauthorized'))
    }
    res.json(post);
})

// @desc    returns an array of posts based on limit and page
// @route   GET /post/?page=PAGE&&limit=LIMIT
// @access  public
exports.getPosts = asyncHandler(async (req, res, next) => {
    const { page, limit } = req.query;
    const conditions = (!req.user || !req.user.roles.includes(9000)) ? { pub: {$exists: true} } : {};
    const query = Post.find(conditions).populate('user', 'name -_id');

    if (page && limit) {
        query.skip(page * limit);
        query.limit(limit);        
    }

    const posts = await query.exec();
    const count = await Post.countDocuments(conditions);

    return res.json({
        total: count,
        page: Number(page) || 0,
        pageSize: posts.length,
        posts,
    })
})

// @desc    creates a new post
// @route   POST /post/
// @access  Admin
exports.createPost = asyncHandler(async (req, res, next) => {
    if (!req.body.title) {
        res.status(400);
        return next(new Error('post requires title'))
    }
    const duplicateTitle = await Post.findOne({title: req.body.title}).exec();
    if (duplicateTitle) {
        res.status(400);
        return next(new Error('Title already exists'))
    }
    const post = {
        user: req.user.id,
        ...req.body
    }
    newPost = await Post.create(post);
    res.json(newPost)
})

// @desc    updates post with associated id
// @route   PUT /post/:id
// @access  Admin
exports.updatePost = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    try {
        if (req.body.pub === false) {
            const unpub = await Post.findByIdAndUpdate(id, {$unset: {pub: 1}}, {new: true})
            delete req.body.pub;
            if (!Object.keys(req.body).length) return res.json(unpub);
        };
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(post);
    } catch (err) {
        res.status(401);
        next(err);
    }
})

// @desc    Delete post with associated id
// @route   DELETE /post/:id
// @access  Admin
exports.deletePost = asyncHandler(async (req, res, next) => {
    try {
        const id = req.params.id;
        await Post.findByIdAndDelete(id);
        res.status(204);
        return res.json({message: 'message successfully deleted'});
    } catch(err) {
        res.status(400);
        return next(err);
    }
})