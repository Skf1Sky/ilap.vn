const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');
const { minioClient, BUCKET_NAME } = require('../config/minio');

class ProductService {
    async getAllProducts() {
        const data = await Product.find().sort({ _id: -1 }).lean();
        return data.map(p => {
            const safeImages = Array.isArray(p.images) ? p.images : [];
            const newImages = safeImages.map(url => {
                if (typeof url === 'string' && url.includes('minio.ntcomp.site')) {
                    return url.replace('minio.ntcomp.site', 's3.ntcomp.site');
                }
                return url;
            });
            return { ...p, images: newImages };
        });
    }

    async createProduct(payload, files) {
        const { name, price, category, specs, discount, video, inStock, brand, condition, rating, quantity } = payload;
        const imageUrls = [];

        if (files && files.length > 0) {
            const uploadPromises = files.map(async (file) => {
                const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
                await minioClient.putObject(BUCKET_NAME, fileName, file.buffer, { 'Content-Type': file.mimetype });
                return `https://s3.ntcomp.site/${BUCKET_NAME}/${fileName}`;
            });
            imageUrls.push(...(await Promise.all(uploadPromises)));
        }

        let parsedSpecs = [];
        try { parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs; } catch(e) { parsedSpecs = []; }

        const newProduct = new Product({
            name, 
            price: Number(price), 
            category, 
            images: imageUrls,
            specs: parsedSpecs, 
            discount, 
            video, 
            brand,
            condition,
            rating: Number(rating) || 5,
            inStock: String(inStock) === 'true' || inStock === true,
            quantity: Number(quantity) || 0, 
            sold: 0
        });

        await newProduct.save();
        return newProduct;
    }

    async updateProduct(id, payload, files) {
        // Cập nhật tất cả các field từ payload
        const { name, price, category, specs, discount, video, inStock, brand, condition, rating, quantity } = payload;
        
        let oldImages = [];
        try { 
            oldImages = typeof payload.oldImages === 'string' ? JSON.parse(payload.oldImages) : (payload.oldImages || []); 
        } catch(e) { 
            oldImages = []; 
        }
        
        let imageUrls = [...oldImages];

        if (files && files.length > 0) {
            const uploadPromises = files.map(async (file) => {
                const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
                await minioClient.putObject(BUCKET_NAME, fileName, file.buffer, { 'Content-Type': file.mimetype });
                return `https://s3.ntcomp.site/${BUCKET_NAME}/${fileName}`;
            });
            imageUrls.push(...(await Promise.all(uploadPromises)));
        }

        let parsedSpecs = [];
        try { 
            parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs; 
        } catch(e) { 
            parsedSpecs = []; 
        }

        const updateData = {
            name, 
            price: price !== undefined ? Number(price) : undefined, 
            category, 
            images: imageUrls,
            specs: parsedSpecs, 
            discount, 
            video, 
            brand,
            condition,
            rating: rating !== undefined ? Number(rating) : undefined,
            inStock: inStock !== undefined ? (String(inStock) === 'true' || inStock === true) : undefined,
            quantity: quantity !== undefined ? Number(quantity) : undefined
        };

        // Loại bỏ các trường undefined để tránh ghi đè dữ liệu cũ bằng null
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedProduct) {
            throw new Error("Sản phẩm không tồn tại hoặc ID không hợp lệ");
        }

        return updatedProduct;
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }

    async importStock(id, amount, note) {
        const parsedAmount = parseInt(amount, 10);
        if (!parsedAmount || parsedAmount <= 0) throw new Error("Số lượng nhập phải > 0");
        
        const product = await Product.findById(id);
        if (!product) throw new Error("Không tìm thấy sản phẩm");
        
        product.quantity += parsedAmount;
        product.inStock = true;
        await product.save();
        
        const log = new InventoryLog({ productId: id, action: 'import', amount: parsedAmount, note: note || 'Nhập kho thủ công' });
        await log.save();
        return { product, log };
    }

    async getInventoryLogs(id) {
        return await InventoryLog.find({ productId: id }).sort({ createdAt: -1 });
    }
}

module.exports = new ProductService();
