const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const passport = require('passport');


router.get('/error/', postController.getError);

router.get('/comments/:id', postController.getPostComments);
router.get('/private/', passport.authenticate('jwtAdmin', { session: false }), postController.getPosts);
router.get('/:id', passport.authenticate(['jwtAdmin', 'anonymous'], { session: false }), postController.getPost);
router.get('/', passport.authenticate(['jwtAdmin', 'anonymous'], { session: false }), postController.getPosts);
router.post('/', passport.authenticate('jwtAdmin', { session: false }), postController.createPost);
router.put('/:id', passport.authenticate('jwtAdmin', { session: false }), postController.updatePost);
router.delete('/:id', passport.authenticate('jwtAdmin', { session: false}), postController.deletePost);

module.exports = router;