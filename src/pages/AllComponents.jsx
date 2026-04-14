import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const AllComponents = ({ products }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lọc lấy toàn bộ Linh kiện
  const allComponents = useMemo(() => {
    return products.filter(p => p.category === 'linhkien');
  }, [products]);

  // Phân loại linh kiện theo loại (trường brand)
  const groupedComponents = useMemo(() => {
    const groups = {};
    const categories = ['Mainboard', 'Chip', 'RAM', 'VGA', 'Nguồn & Case', 'SSD/HDD', 'Khác'];
    
    // Khởi tạo các nhóm theo thứ tự ưu tiên
    categories.forEach(cat => {
      groups[cat] = [];
    });

    allComponents.forEach(p => {
      const type = p.brand || 'Khác';
      if (!groups[type]) groups[type] = [];
      groups[type].push(p);
    });

    return groups;
  }, [allComponents]);

  const activeCategories = Object.keys(groupedComponents).filter(cat => groupedComponents[cat].length > 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-[150px]">
      
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-200 py-3 shadow-sm mb-8">
        <div className="container mx-auto px-4 text-sm text-gray-500 flex items-center">
            <Link to="/" className="hover:text-primary transition-colors">
                <i className="fas fa-home mr-1"></i> Trang chủ
            </Link> 
            <span className="mx-2 text-gray-300">/</span> 
            <span className="uppercase font-bold text-gray-800">Tất cả Linh kiện</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* BANNER / TIÊU ĐỀ */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-800 rounded-xl shadow-lg p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between">
            <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 flex items-center">
                    <i className="fas fa-microchip mr-3 text-emerald-400"></i> Linh Kiện Máy Tính
                </h1>
                <p className="text-emerald-100 font-medium">Nâng cấp cấu hình đỉnh cao với các linh kiện chính hãng, bảo hành dài hạn.</p>
            </div>
            <div className="mt-4 md:mt-0 opacity-20">
                <i className="fas fa-memory text-7xl"></i>
            </div>
        </div>

        {/* QUICK NAVIGATION */}
        <div className="flex flex-wrap gap-2 mb-10 sticky top-[100px] z-30 py-2 bg-gray-50/80 backdrop-blur-md">
            {activeCategories.map(cat => (
                <a 
                    key={cat} 
                    href={`#${cat.replace(/\s/g, '-')}`}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-[11px] font-black uppercase tracking-widest text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
                >
                    {cat} ({groupedComponents[cat].length})
                </a>
            ))}
        </div>

        {/* CÁC NHÓM SẢN PHẨM */}
        {activeCategories.length > 0 ? (
            <div className="space-y-16">
                {activeCategories.map(cat => (
                    <section key={cat} id={cat.replace(/\s/g, '-')} className="scroll-mt-40">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{cat}</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {groupedComponents[cat].map(p => (
                                <ProductCard key={p._id || p.id} product={p} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-300 mb-4"><i className="fas fa-microchip text-6xl"></i></div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Đang tải dữ liệu linh kiện...</h3>
            </div>
        )}
      </div>
    </div>
  );
};

export default AllComponents;
