const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Khách hàng tạo đơn không cần đăng nhập
router.post('/', orderController.createOrder);

// Admin quản lý
router.get('/', verifyToken, checkRole(['admin']), orderController.getOrders);
router.get('/:id', verifyToken, checkRole(['admin']), orderController.getOrderById);
router.put('/:id', verifyToken, checkRole(['admin']), orderController.updateOrder);
router.delete('/:id', verifyToken, checkRole(['admin']), orderController.deleteOrder);

module.exports = router;
