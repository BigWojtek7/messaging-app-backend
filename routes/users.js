const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

router.post('/login', user_controller.login_post);

router.post('/register', user_controller.register_post);

router.get('/auth', user_controller.authenticate_get)

router.get('/logout', user_controller.logout_get);

module.exports = router;
