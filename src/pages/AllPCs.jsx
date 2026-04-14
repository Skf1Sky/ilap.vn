import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const AllPCs = ({ products }) => {
  const [pcs, setPcs] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Lọc lấy toàn bộ PC
    const allPcs = products.filter(p => p.category === 'pc');
    setPcs(allPcs);
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
            <span className="uppercase font-bold text-gray-800">Tất cả PC - Máy bàn</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* BANNER / TIÊU ĐỀ */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between">
            <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 flex items-center">
                    <i className="fas fa-desktop mr-3 text-orange-500"></i> PC Gaming & Đồ Hoạ
                </h1>
                <p className="text-slate-300 font-medium">Lựa chọn cấu hình tối ưu, linh kiện chính hãng cho trải nghiệm làm việc và giải trí đỉnh cao.</p>
            </div>
            <div className="mt-4 md:mt-0 opacity-20">
                <i className="fas fa-rocket text-7xl"></i>
            </div>
        </div>

        {/* CÁC SẢN PHẨM */}
        {pcs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pcs.map(p => (
                    <ProductCard key={p._id || p.id} product={p} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-300 mb-4"><i className="fas fa-folder-open text-6xl"></i></div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Chưa có sản phẩm PC nào...</h3>
                <p className="text-gray-400">Vui lòng quay lại sau hoặc liên hệ hỗ trợ.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AllPCs;
