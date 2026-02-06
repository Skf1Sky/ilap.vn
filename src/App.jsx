import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios'; 

// Import các Layout & Pages
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import Login from './pages/admin/Login'; // Nhớ tạo file Login.jsx trước nhé

// URL Backend Node.js
const API_URL = "http://localhost:5000/products";

// Component cuộn lên đầu trang khi chuyển trang
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Layout cho khách (Có Header + Footer)
const PublicLayout = ({ children }) => {
  return (
    <div className="font-sans text-gray-700 bg-gray-50">
       <Header />
       {children}
       <Footer />
    </div>
  );
};

// Component Bảo vệ (Chặn người lạ vào Admin)
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin');
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [products, setProducts] = useState([]);

  // 1. LẤY DỮ LIỆU TỪ DB KHI MỞ WEB
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const res = await axios.get(API_URL);
            
            // 👇 LOGIC QUAN TRỌNG: Chuẩn hóa dữ liệu từ MongoDB
            const fixedData = res.data.map(p => {
                // Xử lý ảnh: Nếu có mảng ảnh thì dùng, nếu không thì tạo mảng từ ảnh lẻ
                const listImages = p.images && p.images.length > 0 ? p.images : [p.image];
                
                return {
                    ...p,
                    id: p._id, // Copy _id thành id cho Frontend dễ dùng
                    images: listImages, // Mảng ảnh (cho trang chi tiết)
                    image: listImages[0] || 'https://via.placeholder.com/300' // Ảnh đại diện (cho trang chủ)
                };
            });

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
        
        // Chuẩn hóa data trả về ngay lập tức
        const listImages = res.data.images && res.data.images.length > 0 ? res.data.images : [res.data.image];
        const savedProduct = { 
            ...res.data, 
            id: res.data._id,
            images: listImages,
            image: listImages[0]
        };
        
        setProducts([savedProduct, ...products]); 
        alert("Đã thêm thành công!");
    } catch (error) {
        console.error(error);
        alert("Lỗi server khi thêm!");
    }
  };

  // 3. HÀM SỬA
  const updateProduct = async (updatedProduct) => {
    try {
        const realId = updatedProduct._id || updatedProduct.id; 
        
        await axios.put(`${API_URL}/${realId}`, updatedProduct);
        
        // Cập nhật lại state local
        setProducts(products.map(p => {
            if (p.id === realId || p._id === realId) {
                // Logic xử lý ảnh cho item vừa sửa
                const listImages = updatedProduct.images && updatedProduct.images.length > 0 
                                   ? updatedProduct.images 
                                   : [updatedProduct.image];
                return { 
                    ...updatedProduct, 
                    id: realId,
                    images: listImages,
                    image: listImages[0]
                };
            }
            return p;
        }));
        alert("Cập nhật thành công!");
    } catch (error) {
        console.error(error);
        alert("Lỗi cập nhật!");
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
        {/* TRANG LOGIN */}
        <Route path="/login" element={<Login />} />

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

        {/* KHU VỰC ADMIN (CÓ BẢO VỆ) */}
        <Route path="/admin" element={
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
        }>
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