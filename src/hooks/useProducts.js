import { useState, useCallback } from 'react';
import * as productService from '../services/productService';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Danh Sách SP
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const rawData = await productService.getProducts();
            
            // LOGIC QUAN TRỌNG: Chuẩn hóa dữ liệu từ MongoDB
            const fixedData = rawData.map(p => {
                const listImages = p.images && p.images.length > 0 ? p.images : [p.image];
                return {
                    ...p,
                    id: p._id, // Copy _id thành id cho Frontend dễ dùng
                    images: listImages,
                    image: listImages[0] || 'https://via.placeholder.com/300'
                };
            });
            
            setProducts(fixedData);
            setError(null);
        } catch (err) {
            setError(err.message || "Lỗi tải sản phẩm");
        } finally {
            setLoading(false);
        }
    }, []);

    // Helper tạo FormData (chỉ xài nội bộ hook hoặc service)
    const buildFormData = (productData) => {
        const payload = new FormData();
        Object.keys(productData).forEach(key => {
            if (key === 'oldImages' || key === 'specs') {
                payload.append(key, JSON.stringify(productData[key] || []));
            } else if (key === 'newFiles') {
                productData.newFiles.forEach(file => payload.append('images', file));
            } else {
                payload.append(key, productData[key] !== null && productData[key] !== undefined ? productData[key] : '');
            }
        });
        return payload;
    };

    // Tạo SP Mới
    const addProduct = async (productData) => {
        try {
            const payload = buildFormData(productData);
            const res = await productService.createProduct(payload);
            if (res.success) {
                setProducts(prev => [res.product, ...prev]);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Cập nhật SP
    const updateProduct = async (id, productData) => {
        try {
            const payload = buildFormData(productData);
            const res = await productService.updateProduct(id, payload);
            if (res.success) {
                setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? res.product : p));
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Xóa SP
    const removeProduct = async (id) => {
        try {
            const res = await productService.deleteProduct(id);
            if (res.success) {
                setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Nhập hàng & Lấy lịch sử thì để Service làm việc thẳng 
    // vì nó ko thay đổi quá nhiều logic state trừ số lượng
    const performImportStock = async (id, amount, note) => {
         try {
             const res = await productService.importStock(id, amount, note);
             if (res.success) {
                // Update quantity local
                setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? res.product : p));
             }
             return res;
         } catch(err) {
             console.error(err);
             return { success: false };
         }
    };

    const fetchInventoryLogs = async (id) => {
         try {
             const res = await productService.getInventoryLogs(id);
             return res.logs || [];
         } catch(err) {
             return [];
         }
    };

    return {
        products, loading, error,
        fetchProducts, addProduct, updateProduct, removeProduct,
        performImportStock, fetchInventoryLogs, setProducts
    };
};
