const express = require('express');
const router = express.Router();
const passport = require('passport');

const user_controller = require('../controllers/userController');
router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_get
);
router.get(
  '/all-users',
  passport.authenticate('jwt', { session: false }),
  user_controller.all_usernames_get
);
router.post('/login', user_controller.user_login_post);
router.patch(
  '/:userid/username',
  passport.authenticate('jwt', { session: false }),
  user_controller.username_edit
);
router.patch(
  '/:userid/password',
  passport.authenticate('jwt', { session: false }),
  user_controller.password_edit
);

// router.get('/login-failure', user_controller.login_failure_get)

router.post('/register', user_controller.register_post);

router.get('/logout', user_controller.logout_get);

module.exports = router;
