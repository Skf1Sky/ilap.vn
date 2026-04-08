import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import các Layout & Pages
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AllLaptops from './pages/AllLaptops';
import Contact from './pages/Contact';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Login from './pages/admin/Login'; // Nhớ tạo file Login.jsx trước nhé

// URL Backend Node.js
const API_URL = "https://database.ntcomp.site/api/products";

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
      const { id, newFiles, oldImages, ...data } = newProduct;

      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'specs') {
          formData.append('specs', JSON.stringify(data.specs));
        } else {
          formData.append(key, data[key]);
        }
      });

      if (newFiles && newFiles.length > 0) {
        newFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Chuẩn hóa data trả về ngay lập tức
      const productData = res.data.product;
      const listImages = productData.images && productData.images.length > 0 ? productData.images : [productData.image];
      const savedProduct = {
        ...productData,
        id: productData._id,
        images: listImages,
        image: listImages[0] || 'https://via.placeholder.com/300'
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
      const { id, _id, newFiles, oldImages, images, image, ...data } = updatedProduct;

      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'specs') {
          formData.append('specs', JSON.stringify(data.specs));
        } else {
          formData.append(key, data[key]);
        }
      });

      if (oldImages && oldImages.length > 0) {
        formData.append('oldImages', JSON.stringify(oldImages));
      }

      if (newFiles && newFiles.length > 0) {
        newFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      const res = await axios.put(`${API_URL}/${realId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Cập nhật lại state local
      const productData = res.data.product;
      setProducts(products.map(p => {
        if (p.id === realId || p._id === realId) {
          const listImages = productData.images && productData.images.length > 0 ? productData.images : [productData.image];
          return {
            ...productData,
            id: productData._id,
            images: listImages,
            image: listImages[0] || 'https://via.placeholder.com/300'
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

        <Route path="/laptops" element={
          <PublicLayout>
            <AllLaptops products={products} />
          </PublicLayout>
        } />

        <Route path="/product/:id" element={
          <PublicLayout>
            <ProductDetail products={products} />
          </PublicLayout>
        } />
        
        <Route path="/contact" element={
          <PublicLayout>
            <Contact />
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
          <Route path="orders" element={<Orders products={products} />} />
          <Route path="customers" element={<Customers products={products} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;