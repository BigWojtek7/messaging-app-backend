const express = require('express');
const router = express.Router();
const passport = require('passport');

const message_controller = require('../controllers/messageController');

/* GET users listing. */
router.get(
  '/:userid/messages-num',
  passport.authenticate('jwt', { session: false }),
  message_controller.message_count_get
);
router.get(
  '/:userid/messages',
  passport.authenticate('jwt', { session: false }),
  message_controller.all_messages_get
);

router.post(
  '/create-message',
  passport.authenticate('jwt', { session: false }),
  message_controller.create_message_post
);
router.delete(
  '/:messageid/delete',
  passport.authenticate('jwt', { session: false }),
  message_controller.message_delete
);
module.exports = router;
