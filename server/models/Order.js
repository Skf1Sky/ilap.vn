const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema({
  customerName: String, 
  phone: String, 
  address: String,
  items: [orderItemSchema],
  totalPrice: Number,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
