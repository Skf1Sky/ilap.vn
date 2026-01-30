import React from 'react';
// 👇 THÊM useLocation VÀO DÒNG NÀY
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail'; 

// Component ScrollToTop (Đã sửa lại đúng chuẩn)
const ScrollToTop = () => {
    const { pathname } = useLocation(); // ✅ Dùng useLocation trực tiếp, không có React. ở trước
    
    React.useEffect(() => { 
        window.scrollTo(0, 0); 
    }, [pathname]);
    
    return null;
};

function App() {
  return (
    <BrowserRouter>
      {/* ScrollToTop đặt ở đây để mỗi khi đổi link là cuộn lên đầu */}
      <ScrollToTop /> 

      <div className="font-sans text-gray-700 bg-gray-50">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;