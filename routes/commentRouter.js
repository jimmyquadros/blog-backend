const express = require('express');
const router = express.Router();
const controller = require('../controllers/commentController');
const passport = require('passport');

router.get('/:id', controller.getComments);
// router.get('/:id', controller.getError);
router.post('/', passport.authenticate('jwtUser', { session: false }), controller.postComment);
// router.post('/', passport.authenticate('jwtUser', { session: false }), controller.getError);

router.put('/:id', passport.authenticate(['jwtAdmin', 'jwtUser'], { session: false }), controller.updateComment);
// router.put('/:id', passport.authenticate(['jwtAdmin', 'jwtUser'], { session: false }), controller.getError);

router.delete('/:id', passport.authenticate('jwtAdmin', { session: false }), controller.deleteComment);
// router.delete('/:id', passport.authenticate('jwtAdmin', { session: false }), controller.getError);

module.exports = router;
