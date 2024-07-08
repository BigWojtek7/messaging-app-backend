const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');
router.get('/user', user_controller.user_get);
router.get('/all-users', user_controller.all_usernames_get)
router.post('/login', user_controller.user_login_post);

// router.get('/login-failure', user_controller.login_failure_get)


router.post('/register', user_controller.register_post);


router.get('/logout', user_controller.logout_get);

module.exports = router;
