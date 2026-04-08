import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const icons = [
    'fa-microchip',       // CPU
    'fa-memory',          // RAM
    'fa-hdd',             // SSD
    'fa-desktop',         // Màn hình
    'fa-gamepad',         // VGA
    'fa-battery-full'     // Pin/Khác
  ];

  // Logic điền đầy 6 phần tử
  const specs = [...product.specs];
  while (specs.length < 6) {
    specs.push(""); 
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary transition duration-300 group h-full flex flex-col">
      
      {/* ẢNH SẢN PHẨM */}
      <div className="relative h-[220px] bg-gray-100 overflow-hidden">
        {product.discount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded z-10 shadow-sm">
            {product.discount}
          </span>
        )}
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
        </Link>
      </div>

      {/* THÔNG TIN */}
      <div className="p-4 flex-1 flex flex-col">
        <h5 className="font-bold text-base mb-1 group-hover:text-primary transition line-clamp-1">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h5>
        
        <p className="text-[11px] text-gray-500 mb-3 font-semibold uppercase tracking-wide truncate">{product.subtitle}</p>
        
        {/* 👇 GRID 3 CỘT: Bỏ viền ngoài, Bỏ màu nền, Chỉ giữ gạch trong */}
        <div className="grid grid-cols-3 mt-auto pt-2">
            {specs.slice(0, 6).map((spec, i) => {
                // Logic vẽ đường kẻ
                const isLastInRow = (i + 1) % 3 === 0; // Là ô cuối hàng (3, 6) -> Không vẽ gạch phải
                const isFirstRow = i < 3;              // Là hàng đầu (0, 1, 2) -> Vẽ gạch dưới

                return (
                    <div 
                        key={i} 
                        className={`
                            flex flex-col items-center justify-center p-2 h-[55px]
                            ${!isLastInRow ? 'border-r border-gray-100' : ''}  /* Chỉ gạch dọc bên trong */
                            ${isFirstRow ? 'border-b border-gray-100' : ''}    /* Chỉ gạch ngang bên trong */
                        `}
                    >
                       {/* Icon */}
                       <i className={`fas ${icons[i] || 'fa-circle'} text-[10px] mb-1 ${spec ? 'text-gray-400' : 'text-gray-200'}`}></i>
                       
                       {/* Text */}
                       <span className={`text-[10px] font-medium text-center leading-tight line-clamp-2 ${spec ? 'text-gray-600' : 'text-transparent select-none'}`}>
                          {spec || "-"}
                       </span>
                    </div>
                );
            })}
        </div>
        
        {/* GIÁ & NÚT */}
        <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-100">
          <span className="text-red-600 font-bold text-lg">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </span>
          <Link to={`/product/${product.id}`} className="px-4 py-1.5 bg-red-600 text-white text-[11px] font-bold rounded hover:bg-red-700 shadow-md shadow-red-200 transition">
            MUA NGAY
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;