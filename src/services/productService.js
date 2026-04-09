import api from '../api'; // Tạm thời vẫn trỏ về api gốc cho đến khi quy hoạch xong toàn bộ

export const getProducts = async () => {
    const res = await api.get('/api/products');
    return res.data;
};

export const createProduct = async (formData) => {
    const res = await api.post('/api/products', formData);
    return res.data;
};

export const updateProduct = async (id, formData) => {
    const res = await api.put(`/api/products/${id}`, formData);
    return res.data;
};

export const deleteProduct = async (id) => {
    const res = await api.delete(`/api/products/${id}`);
    return res.data;
};

export const importStock = async (id, amount, note) => {
    const res = await api.post(`/api/products/${id}/import`, { amount, note });
    return res.data;
};

export const getInventoryLogs = async (id) => {
    const res = await api.get(`/api/products/${id}/inventory-logs`);
    return res.data;
};
