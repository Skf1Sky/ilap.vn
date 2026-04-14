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
      <section className="relative z-20 px-4 -mt-24 pb-16">
        <div className="container mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 transition-all duration-300 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center p-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl shadow-inner">
                  <i className="fas fa-laptop"></i>
                </div>
                <div>
                  <span className="block text-xs text-primary/60 uppercase font-black tracking-[0.2em] mb-1">Sản phẩm bán chạy</span>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                    LAPTOP <span className="text-primary tracking-normal font-light italic text-2xl">BÁN CHẠY</span>
                  </h2>
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <Link to="/laptops" className="px-6 py-2 rounded-full border border-gray-100 flex items-center text-sm font-black text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all group scale-95 hover:scale-100">
                  XEM TẤT CẢ <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>

            <div className="p-8 pt-4">
              {/* BRAND SELECTOR LAPTOP - Premium Glass Taps */}
              <div className="grid grid-cols-2 md:grid-cols-6 mb-10 overflow-hidden rounded-xl border border-gray-100/50 shadow-sm">
                  {laptopBrands.map(brand => (
                      <button 
                          key={brand}
                          onClick={() => { setSelectedLaptopBrand(brand); setVisibleLaptops(4); }}
                          className={`py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-r last:border-r-0 ${
                            selectedLaptopBrand === brand 
                            ? 'bg-primary text-white shadow-xl scale-[1.02] z-10' 
                            : 'bg-white text-gray-400 hover:bg-primary/5 hover:text-primary hover:backdrop-blur-sm'
                          }`}
                      >
                          {brand}
                      </button>
                  ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {allLaptops.slice(0, visibleLaptops).map(p => <ProductCard key={p._id || p.id} product={p} />)}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={handleToggleLaptop}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-500 shadow-lg hover:shadow-primary/30"
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
      <section className="px-4 pb-16">
        <div className="container mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 transition-all duration-300 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center p-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 text-2xl shadow-inner border border-orange-100">
                  <i className="fas fa-desktop"></i>
                </div>
                <div>
                  <span className="block text-xs text-orange-500/60 uppercase font-black tracking-[0.2em] mb-1">Thiết kế & Chơi Game</span>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
                    PC GAMING <span className="font-light italic text-orange-500 tracking-normal capitalize">Chuyên Nghiệp</span>
                  </h2>
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <Link to="/pcs" className="px-6 py-2 rounded-full border border-gray-100 flex items-center text-sm font-black text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all group scale-95 hover:scale-100">
                  KHÁM PHÁ NGAY <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>

            <div className="p-8 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {allPCs.slice(0, visiblePCs).map(p => <ProductCard key={p._id || p.id} product={p} />)}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={handleTogglePC}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-500 shadow-lg"
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
      <section className="px-4 pb-16">
        <div className="container mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 transition-all duration-300 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center p-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl shadow-inner border border-emerald-100">
                  <i className="fas fa-microchip"></i>
                </div>
                <div>
                  <span className="block text-xs text-emerald-600/60 uppercase font-black tracking-[0.2em] mb-1">Nâng cấp cấu hình</span>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
                    LINH KIỆN <span className="font-light italic text-emerald-500 tracking-normal capitalize">Máy Tính</span>
                  </h2>
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <Link to="/linhkien" className="px-6 py-2 rounded-full border border-gray-100 flex items-center text-sm font-black text-gray-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all group scale-95 hover:scale-100">
                  XEM THÊM <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>

            <div className="p-8 pt-4">
              {/* Linh Kien Category Selector - Glass Taps */}
              <div className="grid grid-cols-2 sm:grid-cols-5 mb-10 overflow-hidden rounded-xl border border-gray-100/50 shadow-sm">
                  {linhKienCategories.map(cat => (
                      <button 
                          key={cat}
                          onClick={() => { setSelectedLinhKienBrand(cat); setVisibleLinhKien(4); }}
                          className={`py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-r last:border-r-0 ${
                            selectedLinhKienBrand === cat 
                            ? 'bg-emerald-600 text-white shadow-xl scale-[1.02] z-10' 
                            : 'bg-white text-gray-400 hover:bg-emerald-600/5 hover:text-emerald-600 hover:backdrop-blur-sm'
                          }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {allLinhKien.slice(0, visibleLinhKien).map(p => <ProductCard key={p._id || p.id} product={p} />)}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={handleToggleLinhKien}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-emerald-600/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-500 shadow-lg"
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