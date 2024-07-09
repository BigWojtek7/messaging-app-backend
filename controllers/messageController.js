// const User = require('../models/user');
// const bcrypt = require('bcryptjs');
const { jwtDecode } = require('jwt-decode');
const Message = require('../models/messages');
const { body, validationResult } = require('express-validator');

exports.message_count_get = async (req, res) => {
  try {
    const userMessageNum = await Message.countDocuments({
      receiver: req.params.userid,
    }).exec();
    res.json(userMessageNum);
  } catch (err) {
    console.log(err);
  }
};

exports.all_messages_get = async (req, res) => {
  try {
    const allUserMessages = await Message.find({ receiver: req.params.userid })
      .sort({ date: 1 })
      .populate('author', 'username')
      .exec();
    res.json(allUserMessages);
  } catch (err) {
    console.log(err);
  }
};

exports.create_message_post = [
  body('title', 'title is require').trim().isLength({ min: 1 }).escape(),
  body('content', 'content is required').trim().isLength({ min: 1 }).escape(),

  async (req, res) => {
    const errors = validationResult(req);

    const userId = jwtDecode(req.headers.authorization).sub;

    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      date: new Date(),
      author: userId,
      receiver: req.body.receiver,
    });

    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    } else {
      try {
        await message.save();
      } catch (err) {
        console.log(err);
      }
      res.json({ success: true, msg: 'Message has been sent' });
    }
  },
];

exports.message_delete = async (req, res, next) => {
  try{
    await Message.findByIdAndDelete(req.params.messageid);
  }catch(err){
    next(err)
  }
  res.json({ success: true, msg: 'Message deleted' });
};
