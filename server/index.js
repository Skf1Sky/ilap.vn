require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

// Import cấu hình external modules
const { initMinioBucket } = require('./config/minio');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// 1. Bảo mật Headers và NoSQL Injection
app.use(helmet());
app.use(mongoSanitize());

// 2. Cookie parser
app.use(cookieParser());

// 3. Cấu hình CORS an toàn
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:5173'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// 4. Kết nối MongoDB
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/ilap_shop";
mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// 3. Khởi tạo MinIO
initMinioBucket();

// 4. Routes chính
//app.get("/", (req, res) => res.send("🚀 API is running perfectly!"));

// Lưu ý /api/auth chứa login và seed-admin
app.use('/api/auth', authRoutes);

// Đăng ký cả 2 đường dẫn products theo như cũ (do frontend dùng '/api/products' hoặc '/products')
// Tuy nhiên frontend trong App.jsx đang dùng '/api/products', tôi sẽ dùng chung '/api'
app.use('/api/products', productRoutes);
app.use('/products', productRoutes); // Alias cho frontend hoặc code cũ 

app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/stats', statsRoutes);

//  Them doan nay
const path = require("path");

// Serve file tĩnh
app.use(express.static(path.join(__dirname, "../dist")));

// Fallback cho React (KHÔNG đụng API)
app.use((req, res, next) => {
  if (!req.path.startsWith("/api") && req.method === "GET") {
    return res.sendFile(path.join(__dirname, "../dist/index.html"));
  }
  next();
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server up tại port ${PORT}`);
});
