const express = require('express');
const { register, login, logout } = require('../controllers/auth.js');
const upload = require('../utils/upload.js');

const router = express.Router();

router.post('/register', upload.single('user_img'), register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;