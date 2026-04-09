const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
// Route tiện ích (ẩn đi sau khi đã gọi 1 lần)
router.get('/seed-admin', authController.seedAdmin);

module.exports = router;
