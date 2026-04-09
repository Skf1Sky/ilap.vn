const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String, 
  phone: String, 
  productName: String, 
  productId: String,
  purchaseDate: Date, 
  warrantyPolicy: String, 
  note: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
