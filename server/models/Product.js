const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String, 
  price: Number, 
  category: String, 
  images: [String], 
  specs: [{ name: String, value: String }], 
  discount: String, 
  condition: String,
  originalPrice: Number,
  video: String, 
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
