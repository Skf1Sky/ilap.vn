import axios from 'axios';

// Tạo một instance của axios
const api = axios.create({
  baseURL: 'https://database.ntcomp.site', // Sử dụng domain api hiện tại của bạn
});

// Thêm token vào mỗi request nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Xử lý lỗi trả về (đặc biệt là 401 - hết hạn token hoặc không được phép)
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Nếu token lỗi hoặc hết hạn, tự động logout
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
