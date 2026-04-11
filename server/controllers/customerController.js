const Customer = require('../models/Customer');

const createCustomer = async (req, res) => {
    try {
        const newCus = new Customer(req.body);
        await newCus.save();
        res.json({ success: true, customer: newCus });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getCustomers = async (req, res) => {
    try { res.json(await Customer.find().sort({ createdAt: -1 })); } 
    catch (err) { res.status(500).json({ success: false }); }
};

const deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};

const checkWarranty = async (req, res) => {
    try {
        const { phone } = req.params;
        if (!phone) return res.status(400).json({ success: false, message: "Thiếu số điện thoại" });
        const records = await Customer.find({ phone }).sort({ purchaseDate: -1 });
        res.json({ success: true, data: records });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
  createCustomer,
  getCustomers,
  deleteCustomer,
  checkWarranty
};
