import React from 'react';
import { useParams } from 'react-router-dom';

// Tạm thời import dữ liệu giả để test (Sau này sẽ fetch từ API)
// Bạn nhớ copy mảng PRODUCTS vào 1 file riêng ví dụ src/data.js rồi export ra nhé
import { PRODUCTS } from '../data'; 

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL (vd: /product/1 => id = 1)
  
  // Tìm sản phẩm trong mảng giả
  const product = PRODUCTS.find(p => p.id === parseInt(id));

  if (!product) return <div className="text-center py-20">Sản phẩm không tồn tại!</div>;

  return (
    <div className="pt-32 pb-16 container mx-auto px-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-8">
        Trang chủ / {product.category === 'laptop' ? 'Laptop' : 'PC'} / <span className="text-gray-800 font-bold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Ảnh Trái */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <img src={product.image} alt={product.name} className="w-full h-auto object-contain hover:scale-105 transition duration-500" />
        </div>

        {/* Thông tin Phải */}
        <div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">{product.name}</h1>
          <p className="text-gray-500 text-lg mb-4">{product.subtitle}</p>
          
          <div className="text-3xl font-bold text-red-600 mb-6">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </div>

          {/* Thông số kỹ thuật */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
             <h3 className="font-bold mb-4 uppercase text-sm text-gray-400">Cấu hình chi tiết</h3>
             <ul className="space-y-3">
                {product.specs.map((spec, index) => (
                    <li key={index} className="flex items-center">
                        <i className="fas fa-check-circle text-primary mr-3"></i>
                        <span className="font-medium">{spec}</span>
                    </li>
                ))}
             </ul>
          </div>

          {/* Nút Mua */}
          <div className="flex gap-4">
             <button className="flex-1 bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-600/30 uppercase">
                Mua Ngay
             </button>
             <button className="flex-1 bg-blue-50 text-primary font-bold py-4 rounded-lg hover:bg-primary hover:text-white transition uppercase border border-primary">
                Thêm vào giỏ
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;