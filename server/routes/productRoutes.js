const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', productController.getProducts);

// Protected Admin routes
router.post('/', verifyToken, checkRole(['admin']), upload.array('images', 4), productController.uploadProducts);
router.put('/:id', verifyToken, checkRole(['admin']), upload.array('images', 4), productController.updateProduct);
router.delete('/:id', verifyToken, checkRole(['admin']), productController.deleteProduct);

// Inventory routes
router.post('/:id/import', verifyToken, checkRole(['admin']), productController.importStock);
router.get('/:id/inventory-logs', verifyToken, checkRole(['admin']), productController.getInventoryLogs);

module.exports = router;
