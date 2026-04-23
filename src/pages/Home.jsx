import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = ({ products }) => {
  // Logic hiển thị Xem thêm / Thu gọn
  const [visibleLaptops, setVisibleLaptops] = useState(4);
  const [visiblePCs, setVisiblePCs] = useState(4);
  const [visibleLinhKien, setVisibleLinhKien] = useState(4);
  
  const [selectedLaptopBrand, setSelectedLaptopBrand] = useState('Tất cả');
  const [selectedLinhKienBrand, setSelectedLinhKienBrand] = useState('Tất cả');

  const laptopBrands = ['Tất cả', 'Dell', 'Asus', 'Lenovo', 'MSI', 'Acer'];
  const linhKienCategories = ['Tất cả', 'Mainboard', 'Chip', 'RAM', 'VGA'];

  const INCREMENT = 4;
  const MAX_DISPLAY = 12;

  // Lọc dữ liệu trực tiếp từ props truyền xuống từ App.jsx
  const allLaptops = products.filter(p => {
    const isCategory = p.category === 'laptop';
    const isBrand = selectedLaptopBrand === 'Tất cả' || p.brand === selectedLaptopBrand;
    return isCategory && isBrand;
  });

  const allPCs = products.filter(p => p.category === 'pc');

  const allLinhKien = products.filter(p => {
    if (p.category !== 'linhkien') return false;
    if (selectedLinhKienBrand === 'Tất cả') return true;
    
    // Ưu tiên khớp theo trường 'brand' (đã lưu loại linh kiện: Mainboard, Chip, RAM...)
    if (p.brand === selectedLinhKienBrand) return true;

    // Fallback: Tìm trong tên nếu brand không khớp (cho dữ liệu cũ)
    const name = p.name ? p.name.toLowerCase() : '';
    const cat = selectedLinhKienBrand.toLowerCase();

    // Map keywords to categories
    if (cat === 'mainboard') return name.includes('main') || name.includes('motherboard') || name.includes('z790') || name.includes('b760') || name.includes('h610');
    if (cat === 'chip') return name.includes('chip') || name.includes('cpu') || name.includes('intel') || name.includes('amd') || name.includes('ryzen');
    if (cat === 'ram') return name.includes('ram') || name.includes('memory') || name.includes('ddr');
    if (cat === 'vga') return name.includes('vga') || name.includes('card đồ họa') || name.includes('rtx') || name.includes('gtx') || name.includes('radeon');
    
    return name.includes(cat);
  });

  const handleToggleLaptop = () => {
    if (visibleLaptops >= MAX_DISPLAY || visibleLaptops >= allLaptops.length) {
      setVisibleLaptops(4);
    } else {
      setVisibleLaptops(prev => prev + INCREMENT);
    }
  };

  const handleTogglePC = () => {
    if (visiblePCs >= MAX_DISPLAY || visiblePCs >= allPCs.length) {
      setVisiblePCs(4);
    } else {
      setVisiblePCs(prev => prev + INCREMENT);
    }
  };

  const handleToggleLinhKien = () => {
    if (visibleLinhKien >= MAX_DISPLAY || visibleLinhKien >= allLinhKien.length) {
      setVisibleLinhKien(4);
    } else {
      setVisibleLinhKien(prev => prev + INCREMENT);
    }
  };

  // Nếu chưa có dữ liệu thì hiện thông báo
  if (!products || products.length === 0) return <div className="text-center py-20 animate-pulse text-gray-500 font-bold">Đang tải dữ liệu từ máy chủ...</div>;

  return (
    <div className="bg-graybody pb-10">
      <Hero />

      {/* ================= LAPTOP ZONE ================= */}
      <section className="relative z-20 px-6 -mt-24 mb-20">
        <div className="max-w-[1760px] mx-auto">
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center p-8 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-primary text-2xl border border-gray-100 shadow-sm">
                  <i className="fas fa-laptop"></i>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-[0.2em] mb-1">Sản phẩm bán chạy</span>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
                    LAPTOP <span className="text-primary tracking-normal font-light">Nổi Bật</span>
                  </h2>
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <Link to="/laptops" className="px-6 py-2.5 rounded-full border border-gray-200 flex items-center text-sm font-black text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all group shadow-sm">
                  XEM TẤT CẢ <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>

            <div className="p-8 pt-6 bg-gray-50/30">
              {/* BRAND SELECTOR LAPTOP - Premium Glass Taps */}
              <div className="grid grid-cols-2 md:grid-cols-6 mb-10 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                  {laptopBrands.map(brand => (
                      <button 
                          key={brand}
                          onClick={() => { setSelectedLaptopBrand(brand); setVisibleLaptops(4); }}
                          className={`py-4 text-[12px] font-black uppercase tracking-[0.1em] transition-all border-r border-gray-100 last:border-r-0 ${
                            selectedLaptopBrand === brand 
                            ? 'bg-primary text-white shadow-[0_4px_15px_rgba(30,144,255,0.4)] z-10' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-primary'
                          }`}
                      >
                          {brand}
                      </button>
                  ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                {allLaptops.slice(0, visibleLaptops).map(p => <ProductCard key={p._id || p.id} product={p} />)}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={handleToggleLaptop}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_4px_15px_rgba(30,144,255,0.4)] transition-all duration-300 bg-white"
                >
                  {(visibleLaptops >= MAX_DISPLAY || visibleLaptops >= allLaptops.length) ? (
                    <i className="fas fa-chevron-up text-xl"></i>
                  ) : (
                    <i className="fas fa-chevron-down text-xl"></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PC ZONE ================= */}
      <section className="px-6 mb-20">
        <div className="max-w-[1760px] mx-auto">
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center p-8 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-800 text-2xl border border-gray-100 shadow-sm">
                  <i className="fas fa-desktop"></i>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-[0.2em] mb-1">Thiết kế & Chơi Game</span>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
                    PC GAMING <span className="font-light text-gray-500 tracking-normal capitalize">Chuyên Nghiệp</span>
                  </h2>
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <Link to="/pcs" className="px-6 py-2.5 rounded-full border border-gray-200 flex items-center text-sm font-black text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all group shadow-sm">
                  KHÁM PHÁ NGAY <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>

            <div className="p-8 pt-6 bg-gray-50/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                {allPCs.slice(0, visiblePCs).map(p => <ProductCard key={p._id || p.id} product={p} />)}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={handleTogglePC}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_4px_15px_rgba(30,144,255,0.4)] transition-all duration-300 bg-white"
                >
                  {(visiblePCs >= MAX_DISPLAY || visiblePCs >= allPCs.length) ? (
                    <i className="fas fa-chevron-up text-xl"></i>
                  ) : (
                    <i className="fas fa-chevron-down text-xl"></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LINH KIỆN ZONE ================= */}
      <section className="px-6 mb-20">
        <div className="max-w-[1760px] mx-auto">
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center p-8 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-800 text-2xl border border-gray-100 shadow-sm">
                  <i className="fas fa-microchip"></i>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-[0.2em] mb-1">Nâng cấp cấu hình</span>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
                    LINH KIỆN <span className="font-light text-gray-500 tracking-normal capitalize">Máy Tính</span>
                  </h2>
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <Link to="/linhkien" className="px-6 py-2.5 rounded-full border border-gray-200 flex items-center text-sm font-black text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all group shadow-sm">
                  XEM THÊM <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>

            <div className="p-8 pt-6 bg-gray-50/30">
              {/* Linh Kien Category Selector - Glass Taps */}
              <div className="grid grid-cols-2 sm:grid-cols-5 mb-10 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                  {linhKienCategories.map(cat => (
                      <button 
                          key={cat}
                          onClick={() => { setSelectedLinhKienBrand(cat); setVisibleLinhKien(4); }}
                          className={`py-4 text-[12px] font-black uppercase tracking-[0.1em] transition-all border-r border-gray-100 last:border-r-0 ${
                            selectedLinhKienBrand === cat 
                            ? 'bg-primary text-white shadow-[0_4px_15px_rgba(30,144,255,0.4)] z-10' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-primary'
                          }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                {allLinhKien.slice(0, visibleLinhKien).map(p => <ProductCard key={p._id || p.id} product={p} />)}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={handleToggleLinhKien}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_4px_15px_rgba(30,144,255,0.4)] transition-all duration-300 bg-white"
                >
                  {(visibleLinhKien >= MAX_DISPLAY || visibleLinhKien >= allLinhKien.length) ? (
                    <i className="fas fa-chevron-up text-xl"></i>
                  ) : (
                    <i className="fas fa-chevron-down text-xl"></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;