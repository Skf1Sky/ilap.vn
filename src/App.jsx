import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios'; 

// Import các Layout & Pages
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';

// URL Backend Node.js
const API_URL = "http://localhost:5000/products";

// Component cuộn lên đầu trang khi chuyển trang
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Layout cho khách (Có Header + Footer)
// 👇 ĐÂY LÀ PHẦN BẠN BỊ THIẾU/SAI
const PublicLayout = ({ children }) => {
  return (
    <div className="font-sans text-gray-700 bg-gray-50">
       <Header />
       {children}
       <Footer />
    </div>
  );
};

function App() {
  const [products, setProducts] = useState([]);

  // 1. LẤY DỮ LIỆU TỪ DB KHI MỞ WEB
// 1. LẤY DỮ LIỆU TỪ DB KHI MỞ WEB
useEffect(() => {
  const fetchProducts = async () => {
      try {
          const res = await axios.get(API_URL);
          
          // 👇 BÍ KÍP Ở ĐÂY: Biến đổi dữ liệu ngay khi vừa lấy về
          const fixedData = res.data.map(p => ({
              ...p, 
              id: p._id  // 👉 Copy _id của Mongo thành id để các trang con dùng bình thường
          }));

          setProducts(fixedData);
      } catch (error) {
          console.error("Lỗi lấy dữ liệu:", error);
      }
  };
  fetchProducts();
}, []);

  // 2. HÀM THÊM
const addProduct = async (newProduct) => {
  try {
      const { id, ...data } = newProduct; 
      const res = await axios.post(API_URL, data);
      
      // 👇 Sửa lại chỗ này: Tạo đối tượng chuẩn hóa trước khi lưu vào State
      const savedProduct = { ...res.data, id: res.data._id };
      
      setProducts([savedProduct, ...products]); 
      alert("Đã thêm thành công!");
  } catch (error) {
      // ...
  }
};

// 3. HÀM SỬA
const updateProduct = async (updatedProduct) => {
  try {
      // Lúc gửi lên Server thì dùng _id (hoặc id vì mình đã copy rồi)
      const realId = updatedProduct._id || updatedProduct.id; 
      
      await axios.put(`${API_URL}/${realId}`, updatedProduct);
      
      setProducts(products.map(p => 
          (p.id === realId || p._id === realId) // So sánh cả 2 cho chắc
          ? { ...updatedProduct, id: realId }   // Đảm bảo item mới cũng có id
          : p
      ));
      alert("Cập nhật thành công!");
  } catch (error) {
      // ...
  }
};

  // 4. HÀM XÓA
  const deleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
        await axios.delete(`${API_URL}/${id}`);
        setProducts(products.filter(p => p._id !== id && p.id !== id));
    } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa!");
    }
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* KHU VỰC KHÁCH HÀNG */}
        <Route path="/" element={
          <PublicLayout>
            <Home products={products} />
          </PublicLayout>
        } />
        
        <Route path="/product/:id" element={
          <PublicLayout>
            <ProductDetail products={products} />
          </PublicLayout>
        } />

        {/* KHU VỰC ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={
            <ProductList 
              products={products} 
              onAdd={addProduct} 
              onUpdate={updateProduct} 
              onDelete={deleteProduct} 
            />
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;