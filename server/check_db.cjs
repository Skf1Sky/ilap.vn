const mongoose = require('mongoose');
const MONGO_URL = "mongodb://admin:Thienvip1@192.168.1.30:27017/ilap_shop?authSource=admin";

async function checkProducts() {
  try {
    await mongoose.connect(MONGO_URL);
    const Product = mongoose.model('Product', new mongoose.Schema({ name: String, category: String }));
    const products = await Product.find({});
    console.log(JSON.stringify(products, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkProducts();
