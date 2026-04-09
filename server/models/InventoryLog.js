const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  action: { type: String, enum: ['import', 'export', 'restock_cancel'], required: true },
  amount: { type: Number, required: true },
  note: { type: String }, // vd: "Nhập hàng", "Đơn hàng #XYZ", "Khách huỷ đơn"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
