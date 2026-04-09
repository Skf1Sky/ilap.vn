const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

const getStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await Customer.countDocuments();
        
        // Tổng doanh thu từ các Order ko bị huỷ (status != cancelled)
        const validOrders = await Order.find({ status: { $ne: 'cancelled' } });
        const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        
        const newOrders = await Order.countDocuments({ status: 'pending' });
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        // Aggregation: Doanh thu 7 ngày qua
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0,0,0,0);

        const revenueAgg = await Order.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: sevenDaysAgo }, 
                    status: { $ne: 'cancelled' } 
                } 
            },
            { 
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "+07:00" } },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Tạo mảng chuẩn 7 ngày liên tục phòng trường hợp ngày không có đơn
        const chartData = [];
        const daysInVietnamese = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(d.getDate() + i);
            const dateString = d.toISOString().split('T')[0];
            const dayLabel = daysInVietnamese[d.getDay()];

            // Lấy ID trùng khớp hoặc sinh 0
            const found = revenueAgg.find(r => r._id === dateString);
            chartData.push({
                name: dayLabel,
                fullDate: dateString,
                revenue: found ? found.revenue : 0
            });
        }

        res.json({
            success: true,
            stats: { totalProducts, totalCustomers, totalRevenue, newOrders },
            chartData,
            recentOrders
        });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = {
  getStats
};
