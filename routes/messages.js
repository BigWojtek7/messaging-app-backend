const express = require('express');
const router = express.Router();

const message_controller = require('../controllers/messageController');

/* GET users listing. */
router.get('/:userid/messages', message_controller.all_messages_get);

router.post('/create-message', message_controller.create_message_post);

module.exports = router;
