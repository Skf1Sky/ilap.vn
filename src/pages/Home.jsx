// src/pages/Home.jsx
import React, { useState } from 'react';
import Hero from '../components/Hero'; // Nhớ import Hero
import ProductCard from '../components/ProductCard'; // Nhớ import ProductCard
import { PRODUCTS } from '../data'; // Import dữ liệu từ file vừa tạo

const Home = () => {
  // Lọc dữ liệu gốc từ file data.js
  const allLaptops = PRODUCTS.filter(p => p.category === 'laptop');
  const allPCs = PRODUCTS.filter(p => p.category === 'pc');

  // Logic hiển thị Xem thêm / Thu gọn
  const [visibleLaptops, setVisibleLaptops] = useState(4);
  const [visiblePCs, setVisiblePCs] = useState(4);
  const INCREMENT = 4;
  const MAX_DISPLAY = 12;

  const handleToggleLaptop = () => {
    if (visibleLaptops >= MAX_DISPLAY || visibleLaptops >= allLaptops.length) {
        setVisibleLaptops(4); // Thu gọn
    } else {
        setVisibleLaptops(prev => prev + INCREMENT); // Xem thêm
    }
  };

  const handleTogglePC = () => {
    if (visiblePCs >= MAX_DISPLAY || visiblePCs >= allPCs.length) {
        setVisiblePCs(4); // Thu gọn
    } else {
        setVisiblePCs(prev => prev + INCREMENT); // Xem thêm
    }
  };

  return (
    <div>
      <Hero />
      
      {/* ================= LAPTOP ZONE ================= */}
      {/* Có -mt-24 để chồng lên Hero */}
      <section className="relative z-20 px-4 -mt-24 pb-16"> 
        <div className="container mx-auto">
          
          <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-6 mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary text-xl">
                    <i className="fas fa-laptop"></i>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Best Seller</span>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight">
                      Laptop Cũ Nổi Bật
                    </h2>
                  </div>
               </div>
               
               <div className="mt-4 md:mt-0">
                  <a href="#" className="flex items-center text-sm font-bold text-gray-500 hover:text-primary transition group">
                      Xem tất cả <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </a>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allLaptops.slice(0, visibleLaptops).map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            <div className="text-center mt-10">
                <button 
                    onClick={handleToggleLaptop}
                    className="px-8 py-2.5 border border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition duration-300 group shadow-sm hover:shadow-md"
                >
                    {(visibleLaptops >= MAX_DISPLAY || visibleLaptops >= allLaptops.length) ? (
                        <span>Thu gọn <i className="fas fa-chevron-up ml-2"></i></span>
                    ) : (
                        <span>Xem thêm Laptop <i className="fas fa-chevron-down ml-2 group-hover:translate-y-1 transition-transform"></i></span>
                    )}
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PC ZONE ================= */}
      <section className="px-4 pb-16">
        <div className="container mx-auto">
          
          {/* Style thẻ y hệt Laptop */}
          <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 border border-gray-100">
            
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-6 mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary text-xl">
                    <i className="fas fa-desktop"></i>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">High Performance</span>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight">
                      PC Gaming & Đồ Họa
                    </h2>
                  </div>
               </div>

               <div className="mt-4 md:mt-0">
                  <a href="#" className="flex items-center text-sm font-bold text-gray-500 hover:text-primary transition group">
                      Xem tất cả <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </a>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allPCs.slice(0, visiblePCs).map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            <div className="text-center mt-12">
                <button 
                    onClick={handleTogglePC}
                    className="px-8 py-2.5 border border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition duration-300 group shadow-sm hover:shadow-md"
                >
                    {(visiblePCs >= MAX_DISPLAY || visiblePCs >= allPCs.length) ? (
                        <span>Thu gọn <i className="fas fa-chevron-up ml-2"></i></span>
                    ) : (
                        <span>Xem thêm PC <i className="fas fa-chevron-down ml-2 group-hover:translate-y-1 transition-transform"></i></span>
                    )}
                </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;