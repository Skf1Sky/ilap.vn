import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const icons = [
    'fa-microchip',       // CPU
    'fa-memory',          // RAM
    'fa-hdd',             // SSD
    'fa-desktop',         // Màn hình
    'fa-gamepad',         // VGA
    'fa-battery-full'     // Pin/Khác
  ];

  // Logic điền đầy 6 phần tử
  const specs = [...(product.specs || [])];
  while (specs.length < 6) {
    specs.push(""); 
  }
  
  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

    const isOutOfStock = !product.inStock || product.quantity <= 0;

    return (
    <div className={`bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-primary/20 transition-all duration-500 group h-full flex flex-col hover:-translate-y-2 ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : ''}`}>
      
      {/* ẢNH SẢN PHẨM */}
      <div className="relative h-[280px] bg-gray-50 overflow-hidden">
        {product.condition && (
          <span className={`absolute top-3 left-3 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full z-10 shadow-sm ${
            product.condition === 'New' ? 'bg-emerald-500' : 
            product.condition === '2nd' ? 'bg-amber-500' : 'bg-primary'
          }`}>
            {product.condition}
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded-sm z-10 shadow-lg animate-pulse">
            -{discountPercentage}%
          </span>
        )}
        {product.discount && !discountPercentage && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded z-10 shadow-sm">
            {product.discount}
          </span>
        )}
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
      </div>

      {/* THÔNG TIN */}
      <div className="p-4 flex-1 flex flex-col">
        <h5 className="font-bold text-[16px] mb-1.5 text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h5>

        {product.category !== 'linhkien' && (
          <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400 text-[10px]">
                  {[...Array(5)].map((_, i) => (
                      <i key={i} className={`${i < (product.rating || 5) ? 'fas' : 'far'} fa-star`}></i>
                  ))}
              </div>
              <span className="text-[10px] text-gray-400">({product.reviewsCount || 0})</span>
          </div>
        )}

        {product.category !== 'linhkien' && (
            <p className="text-[11px] text-gray-500 mb-3 font-semibold uppercase tracking-wide truncate">{product.subtitle}</p>
        )}
        
        {/* 👇 GRID 3 CỘT: Bỏ viền ngoài, Bỏ màu nền, Chỉ giữ gạch trong - Ẩn cho Linh kiện */}
        {product.category !== 'linhkien' && (
            <div className="grid grid-cols-3 mt-auto pt-2">
                {specs.slice(0, 6).map((spec, i) => {
                    // Logic vẽ đường kẻ
                    const isLastInRow = (i + 1) % 3 === 0; // Là ô cuối hàng (3, 6) -> Không vẽ gạch phải
                    const isFirstRow = i < 3;              // Là hàng đầu (0, 1, 2) -> Vẽ gạch dưới

                    return (
                        <div 
                            key={i} 
                            className={`
                                flex flex-col items-center justify-center px-1 py-3 min-h-[65px]
                                ${!isLastInRow ? 'border-r border-gray-100' : ''}  /* Chỉ gạch dọc bên trong */
                                ${isFirstRow ? 'border-b border-gray-100' : ''}    /* Chỉ gạch ngang bên trong */
                            `}
                        >
                           {/* Icon */}
                           <i className={`fas ${icons[i] || 'fa-circle'} text-[14px] mb-1.5 ${spec ? 'text-gray-400' : 'text-gray-200'}`}></i>
                           
                           {/* Text */}
                           <span className={`text-[12px] font-bold text-center leading-tight line-clamp-2 ${spec ? 'text-gray-700' : 'text-transparent select-none'}`}>
                              {(typeof spec === 'object' ? spec.value : spec) || "-"}
                           </span>
                        </div>
                    );
                })}
            </div>
        )}
        
        {/* REMOVED TỒN KHO & ĐÃ BÁN */}
        
        {/* GIÁ & RATING */}
        <div className="flex justify-between items-center pt-3 mt-auto border-t border-gray-100 mb-4">
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-[11px] line-through font-medium">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
              </span>
            )}
            <span className="text-red-600 font-black text-[22px] leading-tight">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </span>
          </div>
          <div className={`text-[10px] font-black px-3 py-1 rounded-full border ${
            isOutOfStock 
              ? 'text-red-600 bg-red-50 border-red-100' 
              : 'text-emerald-600 bg-emerald-50 border-emerald-100'
          }`}>
            {isOutOfStock ? 'HẾT HÀNG' : 'SẴN HÀNG'}
          </div>
        </div>

        {/* MUA NGAY BUTTON */}
        <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className={`w-full py-3.5 rounded-lg font-black uppercase text-sm tracking-[0.1em] transition-all duration-300 flex justify-center items-center gap-2 ${
                isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-hover shadow-[0_4px_15px_rgba(30,144,255,0.3)] hover:shadow-[0_8px_25px_rgba(30,144,255,0.5)] transform hover:-translate-y-0.5'
            }`}
            disabled={isOutOfStock}
        >
            <i className="fas fa-shopping-cart"></i> Mua ngay
        </button>
      </div>
    </div>
  );
};

export default ProductCard;