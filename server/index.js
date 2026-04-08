const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Minio = require('minio');
const multer = require('multer');

const app = express();

// 1. Cấu hình CORS mở rộng - Đặt ngay đầu tiên
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 2. Kết nối MongoDB
const MONGO_URL = "mongodb://admin:Thienvip1@192.168.1.30:27017/ilap_shop?authSource=admin";
mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// 3. Models
const User = mongoose.model("User", new mongoose.Schema({
  username: String, password: String, role: { type: String, default: "admin" }
}));

const Product = mongoose.model("Product", new mongoose.Schema({
  name: String, price: Number, category: String, images: [String], 
  specs: [String], discount: String, video: String, inStock: { type: Boolean, default: true }
}));

// 4. Cấu hình MinIO
const minioClient = new Minio.Client({
    endPoint: '192.168.1.40', 
    port: 9000,
    useSSL: false, // Trong mạng LAN dùng false
    accessKey: 'Lv58H5x4PiM9dnQcuYgt', 
    secretKey: 'CKKYXEZ3HuVAINXIQynBb3eIdGoyX0LPa8B1Vjj6', 
    pathStyle: true 
});

const BUCKET_NAME = 'ilap-images';
const upload = multer({ storage: multer.memoryStorage() });

// Hàm khởi tạo Bucket
async function initMinioBucket() {
    try {
        const exists = await minioClient.bucketExists(BUCKET_NAME);
        if (!exists) {
            await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
            const policy = {
                Version: "2012-10-17",
                Statement: [{
                    Effect: "Allow", Principal: "*", Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
                }]
            };
            await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
            console.log(`🔓 MinIO: Đã tạo & mở khóa bucket "${BUCKET_NAME}"`);
        } else {
            console.log(`✅ MinIO: Bucket "${BUCKET_NAME}" đã sẵn sàng.`);
        }
    } catch (err) { console.error("❌ MinIO init error:", err.message); }
}
initMinioBucket();

// 5. Routes
app.get("/", (req, res) => res.send("🚀 API is running perfectly!"));

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    res.json({ success: true, message: "Login success", role: user.role });
  } catch (err) { res.status(500).json({ success: false }); }
});

// ROUTE CHÍNH ĐỂ UP SẢN PHẨM
const uploadHandler = async (req, res) => {
    try {
        const { name, price, category, specs, discount, video, inStock } = req.body;
        const files = req.files;
        const imageUrls = [];

        if (files && files.length > 0) {
            const uploadPromises = files.map(async (file) => {
                const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
                await minioClient.putObject(BUCKET_NAME, fileName, file.buffer, { 'Content-Type': file.mimetype });
                return `https://minio.ntcomp.site/${BUCKET_NAME}/${fileName}`;
            });
            const uploadedUrls = await Promise.all(uploadPromises);
            imageUrls.push(...uploadedUrls);
        }

        let parsedSpecs = [];
        try { parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs; } catch(e) { parsedSpecs = [specs]; }

        const newProduct = new Product({
            name, price: Number(price), category, images: imageUrls,
            specs: parsedSpecs, discount, video, inStock: String(inStock) === 'true'
        });

        await newProduct.save();
        res.json({ success: true, product: newProduct });
    } catch (err) {
        console.error("Lỗi:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Đăng ký cả 2 đường dẫn để tránh lỗi 404
app.post('/api/products', upload.array('images', 4), uploadHandler);
app.post('/products', upload.array('images', 4), uploadHandler);

// ROUTE CẬP NHẬT SẢN PHẨM
const updateHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, specs, discount, video, inStock } = req.body;
        
        let oldImages = [];
        try { oldImages = typeof req.body.oldImages === 'string' ? JSON.parse(req.body.oldImages) : (req.body.oldImages || []); } catch(e) { oldImages = []; }
        
        const files = req.files;
        let imageUrls = [...oldImages];

        if (files && files.length > 0) {
            const uploadPromises = files.map(async (file) => {
                const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
                await minioClient.putObject(BUCKET_NAME, fileName, file.buffer, { 'Content-Type': file.mimetype });
                return `https://minio.ntcomp.site/${BUCKET_NAME}/${fileName}`;
            });
            const uploadedUrls = await Promise.all(uploadPromises);
            imageUrls.push(...uploadedUrls);
        }

        let parsedSpecs = [];
        try { parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs; } catch(e) { parsedSpecs = [specs]; }

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name, price: Number(price), category, images: imageUrls,
            specs: parsedSpecs, discount, video, inStock: String(inStock) === 'true'
        }, { new: true });

        res.json({ success: true, product: updatedProduct });
    } catch (err) {
        console.error("Lỗi cập nhật:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

app.put('/api/products/:id', upload.array('images', 4), updateHandler);
app.put('/products/:id', upload.array('images', 4), updateHandler);

// ROUTE XÓA SẢN PHẨM
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ success: true, message: "Xóa thành công" });
    } catch (err) {
        console.error("Lỗi xóa:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ success: true, message: "Xóa thành công" });
    } catch (err) {
        console.error("Lỗi xóa:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/products", async (req, res) => {
    const data = await Product.find();
    res.json(data);
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server up tại http://192.168.1.20:${PORT}`);
});