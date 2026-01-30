import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary transition duration-300 group h-full flex flex-col">
      <div className="relative h-[240px] bg-gray-100 overflow-hidden">
        {product.discount && (
          <span className="absolute top-4 left-4 bg-red-600 text-white text-[11px] font-bold uppercase px-3 py-1 rounded z-10">
            {product.discount}
          </span>
        )}
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
        </Link>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h5 className="font-bold text-lg mb-1 group-hover:text-primary transition line-clamp-1"><a href="#">{product.name}</a></h5>
        <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">{product.subtitle}</p>
        <div className="flex justify-between border-y border-gray-100 py-3 my-2 text-xs text-gray-600">
            {product.specs.map((spec, i) => (
                <span key={i}><i className={`fas ${i===0?'fa-microchip':i===1?'fa-memory':'fa-hdd'} text-gray-400 mr-1`}></i> {spec}</span>
            ))}
        </div>
        <div className="mt-auto flex justify-between items-center pt-3">
          <span className="text-red-600 font-bold text-lg">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</span>
          <a href="#" className="px-4 py-1.5 bg-blue-50 text-primary text-xs font-bold rounded hover:bg-primary hover:text-white transition">Chi tiết</a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;