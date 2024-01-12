const express = require('express');
const router = express.Router();
const controller = require('../controllers/commentController');
const passport = require('passport');

router.get('/:id', controller.getComments);
router.post('/', passport.authenticate('jwtUser', { session: false }), controller.postComment);
router.put('/:id', passport.authenticate(['jwtAdmin', 'jwtUser'], { session: false }), controller.updateComment);
router.delete('/:id', passport.authenticate('jwtAdmin', { session: false }), controller.deleteComment);

module.exports = router;
