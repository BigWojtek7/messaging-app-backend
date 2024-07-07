const passport = require('passport');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.login_post = function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        success: false, msg: 'Wrong password or username' 
      });
    }

    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user',
        });
      }
      console.log(req.isAuthenticated())
      res.status(200).json({
        status: 'Login successful!',
      });
    });
  })(req, res, next);
};

// exports.login_failure_get = (req, res) => {
//   res.json({ success: false, msg: 'Wrong password or username' });
// };

exports.authenticate_get = (req, res) => {
  console.log(req.session)
  const isAuthenticated = req.isAuthenticated();
  res.json({ authenticated: isAuthenticated });
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
      res.json({ success: false, msg: 'Username already exists' });
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

exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
