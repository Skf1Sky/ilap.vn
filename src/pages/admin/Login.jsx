// 🛠️ File: src/pages/admin/Login.jsx
import React, { useState } from 'react';
import api from '../../api'; // Import axios instance đã cấu hình
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Gọi API login ở Server (Sử dụng đường dẫn mới có JWT)
      const res = await api.post('/api/auth/login', { username, password });
      
      if (res.data.success) {
        // Lưu "thẻ bài" JWT và đánh dấu Admin vào máy người dùng
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('isAdmin', 'true'); 
        alert('Đăng nhập thành công!');
        navigate('/admin'); // Chuyển hướng vào trang Admin
      }
    } catch (error) {
      alert('Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Đăng Nhập Admin</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Tài khoản</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded mt-1"
              value={username} onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded mt-1"
              value={password} onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;