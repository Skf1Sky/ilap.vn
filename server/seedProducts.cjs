const mongoose = require('mongoose');

const MONGO_URL = "mongodb://admin:Thienvip1@192.168.1.30:27017/ilap_shop?authSource=admin";

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
  reviewsCount: { type: Number, default: 0 },
  brand: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("Connected.");

    // 1. Delete old samples
    console.log("Deleting old samples...");
    await Product.deleteMany({
      name: { $in: [
        "Dell XPS 13 9315 (2022) - Sky Blue",
        "Asus ROG Zephyrus G14 GA403 (2024)"
      ]}
    });

    // 2. Add new sample
    console.log("Adding new laptop sample...");
    const newLaptop = new Product({
      name: "MacBook Air M3 (2024) - Midnight",
      price: 32990000,
      originalPrice: 34990000,
      category: "laptop",
      brand: "Apple",
      images: [
        "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-m3-midnight-select-202403?wid=940&hei=1112&fmt=png-alpha&.v=1707844610423"
      ],
      specs: [
        { name: "CPU", value: "Apple M3 8-Core" },
        { name: "RAM", value: "16GB Unified Memory" },
        { name: "SSD", value: "512GB SSD Storage" },
        { name: "Display", value: "13.6-inch Liquid Retina" },
        { name: "GPU", value: "10-Core GPU" },
        { name: "Battery", value: "Up to 18 hours" }
      ],
      discount: "-6%",
      condition: "Mới 100%",
      inStock: true,
      quantity: 10,
      sold: 0,
      rating: 5,
      reviewsCount: 0
    });

    await newLaptop.save();
    console.log("Seeding completed successfully!");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
