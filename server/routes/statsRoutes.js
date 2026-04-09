const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, checkRole(['admin']), statsController.getStats);

module.exports = router;
