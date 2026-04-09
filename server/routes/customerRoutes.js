const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, checkRole(['admin']), customerController.createCustomer);
router.get('/', verifyToken, checkRole(['admin']), customerController.getCustomers);
router.delete('/:id', verifyToken, checkRole(['admin']), customerController.deleteCustomer);

module.exports = router;
