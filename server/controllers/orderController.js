const Order = require('../models/Order');
const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');

const createOrder = async (req, res) => {
    try {
        const { customerName, phone, address, items } = req.body;
        
        let totalPrice = 0;
        
        // Tính totalPrice và trừ stock
        if (items && items.length > 0) {
            for (let item of items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    const itemPrice = item.price || product.price;
                    const qty = item.quantity || 1;
                    const itemTotal = itemPrice * qty;
                    totalPrice += itemTotal;
                    
                    // Trừ tồn kho và tăng đã bán
                    if (product.quantity !== undefined) {
                         product.quantity -= qty;
                         if (product.quantity <= 0) {
                             product.quantity = 0;
                             product.inStock = false;
                         }
                         
                         if (product.sold === undefined) product.sold = 0;
                         product.sold += qty;
                         
                         await product.save();
                         
                         // Ghi log xuất bán
                         await new InventoryLog({
                             productId: product._id,
                             action: 'export',
                             amount: qty,
                             note: `Đơn hàng mới từ ${customerName || phone}`
                         }).save();
                    }
                }
            }
        }

        const newOrder = new Order({
            customerName, phone, address, items, totalPrice
        });
        await newOrder.save();
        res.json({ success: true, order: newOrder });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getOrders = async (req, res) => {
    try { 
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;
        res.json(await Order.find(query).sort({ createdAt: -1 })); 
    } 
    catch (err) { res.status(500).json({ success: false }); }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if(!order) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, order });
    } catch (err) { res.status(500).json({ success: false }); }
}

const updateOrder = async (req, res) => {
    try {
        const { status } = req.body;
        const currentOrder = await Order.findById(req.params.id);
        if(!currentOrder) return res.status(404).json({ success: false });

        // Logic check: Nếu huỷ -> cộng lại kho và giảm sold
        if (status === 'cancelled' && currentOrder.status !== 'cancelled') {
             for (let item of currentOrder.items) {
                 const p = await Product.findById(item.productId);
                 if(p) {
                     p.quantity += item.quantity;
                     p.inStock = p.quantity > 0;
                     if(p.sold >= item.quantity) p.sold -= item.quantity;
                     else p.sold = 0;
                     await p.save();
                     
                     await new InventoryLog({
                         productId: p._id,
                         action: 'restock_cancel',
                         amount: item.quantity,
                         note: `Khách huỷ đơn`
                     }).save();
                 }
             }
        } 
        // Logic check: Nếu từ huỷ chuyển sang các trạng thái khác (un-cancel) -> lại trừ kho
        else if (currentOrder.status === 'cancelled' && status !== 'cancelled') {
             for (let item of currentOrder.items) {
                 const p = await Product.findById(item.productId);
                 if(p) {
                     p.quantity -= item.quantity;
                     if(p.quantity <= 0) { p.quantity = 0; p.inStock = false; }
                     p.sold += item.quantity;
                     await p.save();
                     
                     await new InventoryLog({
                         productId: p._id,
                         action: 'export',
                         amount: item.quantity,
                         note: `Khôi phục đơn hàng`
                     }).save();
                 }
             }
        }

        currentOrder.status = status;
        await currentOrder.save();

        res.json({ success: true, order: currentOrder });
    } catch (err) { res.status(500).json({ success: false }); }
};

const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};
