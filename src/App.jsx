import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useProducts } from './hooks/useProducts';
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

// Bỏ biến cục bộ API đi vì đã cấu hình trong Service layer
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
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { products, addProduct, updateProduct, removeProduct, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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