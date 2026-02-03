import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Import Layout & Pages KHÁCH
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/admin/ProductList';

// Import Layout & Pages ADMIN
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Layout cho khách (Có Header/Footer)
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
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* --- KHU VỰC KHÁCH HÀNG (PUBLIC) --- */}
        <Route path="/" element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        } />

        <Route path="/product/:id" element={
          <PublicLayout>
            <ProductDetail />
          </PublicLayout>
        } />

        {/* --- KHU VỰC ADMIN (RIÊNG BIỆT) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Vào /admin sẽ hiện Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;