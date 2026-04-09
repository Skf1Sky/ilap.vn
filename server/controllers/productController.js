const productService = require('../services/productService');

const getProducts = async (req, res) => {
    try {
        const data = await productService.getAllProducts();
        res.json(data);
    } catch (err) {
        console.error("Lỗi getProducts:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const uploadProducts = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body, req.files);
        res.json({ success: true, product: newProduct });
    } catch (err) {
        console.error("Lỗi uploadProducts:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body, req.files);
        res.json({ success: true, product: updatedProduct });
    } catch (err) {
        console.error("Lỗi updateProduct:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ success: true, message: "Xóa thành công" });
    } catch (err) {
        console.error("Lỗi deleteProduct:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const importStock = async (req, res) => {
    try {
        const { product, log } = await productService.importStock(req.params.id, req.body.amount, req.body.note);
        res.json({ success: true, product, log });
    } catch (err) { 
        res.status(500).json({ success: false, message: err.message }); 
    }
};

const getInventoryLogs = async (req, res) => {
    try {
        const logs = await productService.getInventoryLogs(req.params.id);
        res.json({ success: true, logs });
    } catch (err) { 
        res.status(500).json({ success: false, message: err.message }); 
    }
};

module.exports = {
  uploadProducts,
  updateProduct,
  deleteProduct,
  getProducts,
  importStock,
  getInventoryLogs
};
