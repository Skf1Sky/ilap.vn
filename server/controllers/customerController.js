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

module.exports = {
  createCustomer,
  getCustomers,
  deleteCustomer
};
