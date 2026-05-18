const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validate, loginSchema } = require('../middleware/validator');

router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// Route tiện ích (ẩn đi sau khi đã gọi 1 lần)
router.get('/seed-admin', authController.seedAdmin);

module.exports = router;
