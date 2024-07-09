const { jwtDecode } = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const issueJWT = require('../config/issueJwt');

const User = require('../models/user');

exports.user_get = async (req, res, next) => {
  try {
    const userId = jwtDecode(req.headers.authorization).sub;
    const user = await User.findById(userId, {
      username: 1,
      _id: 1,
    }).exec();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.all_usernames_get = async (req, res, next) => {
  try {
    const users = await User.find({}, '_id username').exec();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.user_login_post = exports.user_login_post = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username }).exec();

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: 'could not find user' });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      const tokenObject = issueJWT(user);
      res.status(200).json({
        success: true,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    } else {
      res
        .status(401)
        .json({ success: false, msg: 'you entered the wrong password' });
    }
  } catch (err) {
    next(err);
  }
};

exports.register_post = [
  body('username', 'Username is required').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password is required').trim().isLength({ min: 1 }).escape(),
  body('re_password', 'Passwords do not match')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .trim()
    .escape(),

  async (req, res) => {
    const userInDatabase = await User.find({
      username: req.body.username,
    }).exec();

    if (userInDatabase.length > 0) {
      res.json({ success: false, msg: [{ msg: 'Username already exists' }] });
      return;
    }

    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    } else {
      await user.save();
      res.json({ success: true, msg: 'New user has been saved' });
    }
  },
];

exports.user_edit = [
  body('username', 'Username is required').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password is required').trim().isLength({ min: 1 }).escape(),
  body('re_password', 'Passwords do not match')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .trim()
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.json({ success: false, msg: errors.array() });
    } else {
      try {
        await User.findByIdAndUpdate(req.params.id, user, {});
      } catch (err) {
        next(err);
      }
      res.json({ success: true, msg: 'user updated' });
    }
  },
];

exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
