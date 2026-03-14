const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Cho phép React truy cập

// 1. KẾT NỐI MONGODB (Thay chuỗi kết nối bạn vừa lấy ở bước Drivers vào đây)
// Lưu ý: Thay <password> bằng mật khẩu user database bạn đã tạo
// 🛠️ Sửa lại dòng 11 thành:
const MONGO_URL = "mongodb://admin:Thienvip1@192.168.1.30:27017/ilap_shop?authSource=admin";

mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ Đã kết nối MongoDB thành công!"))
    .catch((err) => console.error("❌ Lỗi kết nối:", err));

// 2. TẠO BẢNG SẢN PHẨM (SCHEMA)
// Cấu trúc này khớp với dữ liệu bạn đang làm ở Frontend
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    
    // 👇 SỬA DÒNG NÀY: Thay image: String thành images: [String] (Mảng chứa chữ)
    images: [String], 
    
    category: String,
    discount: String,
    video: String,
    inStock: { type: Boolean, default: true },
    specs: [String],
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

// 3. TẠO API (Để React gọi vào)

// API Đăng nhập đơn giản (Hardcode tài khoản để test cho nhanh)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // 👇 THÊM DÒNG NÀY ĐỂ SOI LOG
    console.log("Thử đăng nhập với:", username, "| Pass:", password);

    if (username === 'admin' && password === 'admin123') {
        res.json({ success: true, message: "Đăng nhập thành công!" });
    } else {
        res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
    }
});

// Lấy danh sách
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) { res.status(500).json(err); }
});

// Thêm mới
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (err) { res.status(500).json(err); }
});

// Sửa (Cập nhật)
app.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) { res.status(500).json(err); }
});

// Xóa
app.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json(err); }
});

// Chạy server ở cổng 5000
app.listen(5000, () => {
    console.log("🚀 Server đang chạy tại http://localhost:5000");
});