const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Message = require('../models/messages');
const { body, validationResult } = require('express-validator');

exports.messages_get = async (req, res) => {
  try {
    const allUserMessages = await Message.find({ receiver: req.params.userId })
      .sort({ date: 1 })
      .populate('user')
      .exec();
    res.json({ messages: allUserMessages });
  } catch (err) {
    console.log(err);
  }
};

exports.create_messages_post = [
  body('title', 'title is require').trim().isLength({ min: 1 }).escape(),
  body('content', 'content is required').trim().isLength({ min: 1 }).escape(),

  async (req, res) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      date: new Date(),
      author: req.params.id,
      receiver: req.body.receiver,
    });

    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    } else {
      res.json({ success: true, msg: 'Message has been sent' });
    }
  },
];
