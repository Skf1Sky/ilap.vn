const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String, 
  price: Number, 
  category: String, 
  images: [String], 
  specs: [String], 
  discount: String, 
  video: String, 
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  sold: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
