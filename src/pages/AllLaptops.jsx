import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const AllLaptops = ({ products }) => {
  const [laptops, setLaptops] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Lọc lấy toàn bộ laptop
    const allLaptops = products.filter(p => p.category === 'laptop');
    setLaptops(allLaptops);
  }, [products]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-[150px]">
      
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-200 py-3 shadow-sm mb-8">
        <div className="container mx-auto px-4 text-sm text-gray-500 flex items-center">
            <Link to="/" className="hover:text-primary transition-colors">
                <i className="fas fa-home mr-1"></i> Trang chủ
            </Link> 
            <span className="mx-2 text-gray-300">/</span> 
            <span className="uppercase font-bold text-gray-800">Tất cả Laptop</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* BANNER / TIÊU ĐỀ */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl shadow-lg p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between">
            <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 flex items-center">
                    <i className="fas fa-laptop mr-3 text-red-500"></i> Laptop Nổi Bật
                </h1>
                <p className="text-blue-100 font-medium">Khám phá bộ sưu tập {laptops.length} mẫu laptop xịn với giá tốt nhất thị trường.</p>
            </div>
            <div className="mt-4 md:mt-0 opacity-20">
                <i className="fas fa-microchip text-7xl"></i>
            </div>
        </div>

        {/* CÁC SẢN PHẨM */}
        {laptops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {laptops.map(p => (
                    <ProductCard key={p._id || p.id} product={p} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-300 mb-4"><i className="fas fa-box-open text-6xl"></i></div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Đang tải dữ liệu laptop...</h3>
            </div>
        )}
      </div>
    </div>
  );
};

export default AllLaptops;
