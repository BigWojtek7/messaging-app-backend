const passport = require('passport');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


const issueJWT = require('../config/issueJwt')

const User = require('../models/user');

exports.user_login_post =  (req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    try {
      if (err || !user) {
        const error = new Error('An error occurred.');

        return next(error);
      }
      const tokenObject = issueJWT(user);
      res.status(200).json({
        success: true,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
};

// exports.login_failure_get = (req, res) => {
//   res.json({ success: false, msg: 'Wrong password or username' });
// };

exports.authenticate_get = (req, res) => {
  console.log(req.session);
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
      res.json({ success: false, msg: [{msg:'Username already exists'}]} );
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
