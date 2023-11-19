const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const passport = require('passport');

router.get('/:id', passport.authenticate(['jwtAdmin', 'anonymous'], { session: false }), postController.getPost);
// router.get('/:id', passport.authenticate(['jwtAdmin', 'anonymous'], { session: false }), postController.getError);

router.get('/', passport.authenticate(['jwtAdmin', 'anonymous'], { session: false }), postController.getPosts);
// router.get('/', passport.authenticate(['jwtAdmin', 'anonymous'], { session: false }), postController.getError);

router.post('/', passport.authenticate('jwtAdmin', { session: false }), postController.createPost);
router.put('/:id', passport.authenticate('jwtAdmin', { session: false }), postController.updatePost);
// router.post('/', passport.authenticate('jwtAdmin', { session: false }), postController.getError);
// router.put('/:id', passport.authenticate('jwtAdmin', { session: false }), postController.getError);

router.delete('/:id', passport.authenticate('jwtAdmin', { session: false}), postController.deletePost);
// router.delete('/:id', passport.authenticate('jwtAdmin', { session: false}), postController.getError);

module.exports = router;