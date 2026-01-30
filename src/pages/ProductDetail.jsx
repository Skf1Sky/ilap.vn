import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const foundProduct = PRODUCTS.find(p => p.id === parseInt(id));
    
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.image);
      
      const related = PRODUCTS.filter(p => 
        p.category === foundProduct.category && p.id !== foundProduct.id
      );
      setRelatedProducts(related.slice(0, 4));
    }

    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-[100px]">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Không tìm thấy sản phẩm!</h2>
        <Link to="/" className="text-primary hover:underline font-bold">
          <i className="fas fa-arrow-left mr-2"></i> Quay về trang chủ
        </Link>
      </div>
    );
  }

  const galleryImages = (product.images && product.images.length > 0)
    ? product.images 
    : [product.image, product.image, product.image, product.image];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-[150px]">
      
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-200 py-3 mb-8 shadow-sm">
        <div className="container mx-auto px-4 text-sm text-gray-500 flex items-center">
            <Link to="/" className="hover:text-primary transition-colors">
                <i className="fas fa-home mr-1"></i> Trang chủ
            </Link> 
            <span className="mx-2 text-gray-300">/</span> 
            <span className="uppercase font-semibold text-gray-600">{product.category === 'laptop' ? 'Laptop' : 'PC Gaming'}</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-primary font-bold truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        
        {/* KHỐI THÔNG TIN CHÍNH (Giữ nguyên) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Cột Trái: Gallery */}
            <div className="md:col-span-5">
               <div className="border border-gray-100 rounded-lg overflow-hidden relative group mb-4 flex items-center justify-center bg-white h-[350px]">
                  {product.discount && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded shadow-md z-10">
                        {product.discount}
                    </span>
                  )}
                  <img src={activeImage} alt={product.name} className="max-w-full max-h-full object-contain transition duration-500 group-hover:scale-105" />
               </div>
               <div className="grid grid-cols-4 gap-3">
                  {galleryImages.map((img, index) => (
                      <div 
                        key={index}
                        onClick={() => setActiveImage(img)}
                        className={`border-2 rounded-md overflow-hidden cursor-pointer h-20 p-1 bg-white transition-all duration-200 hover:border-primary ${activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
                      >
                          <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                      </div>
                  ))}
               </div>
            </div>

            {/* Cột Phải: Thông tin giá bán */}
            <div className="md:col-span-7">
               <h1 className="text-3xl font-black text-gray-800 mb-2 leading-tight">{product.name}</h1>
               {/* ... (Phần thông tin giá, khuyến mãi giữ nguyên) ... */}
               <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-100 relative overflow-hidden">
                  <div className="text-3xl font-bold text-red-600 mb-2 flex items-end gap-3">
                     {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                     <span className="text-gray-400 text-lg font-normal line-through mb-1">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 1.2)}
                     </span>
                  </div>
               </div>

               <div className="border border-dashed border-red-300 bg-red-50/50 rounded-lg p-4 mb-8">
                  <h4 className="text-red-600 font-bold uppercase text-sm mb-3 flex items-center"><i className="fas fa-gift mr-2 text-lg"></i> Quà tặng & Ưu đãi</h4>
                  <ul className="text-sm space-y-2 text-gray-700 ml-1">
                     <li className="flex items-start"><i className="fas fa-check text-green-500 mt-1 mr-2"></i> Tặng Balo chống sốc cao cấp.</li>
                     <li className="flex items-start"><i className="fas fa-check text-green-500 mt-1 mr-2"></i> Tặng Chuột không dây Logitech.</li>
                     <li className="flex items-start"><i className="fas fa-check text-green-500 mt-1 mr-2"></i> Cài đặt Windows bản quyền trọn đời.</li>
                  </ul>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold uppercase shadow-lg shadow-red-600/30 transition transform hover:-translate-y-1">
                     <span className="block text-xl"><i className="fas fa-shopping-cart mr-2"></i> Mua Ngay</span>
                  </button>
                  <button className="flex-1 border-2 border-primary text-primary hover:bg-blue-50 py-4 rounded-lg font-bold uppercase transition flex flex-col items-center justify-center">
                     <span className="block text-lg">Trả Góp 0%</span>
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* 3. BẢNG THÔNG SỐ & VIDEO REVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột Trái: Bảng thông số (Chiếm 2 phần) */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 uppercase border-l-4 border-primary pl-3">Thông số kỹ thuật</h3>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <tbody className="divide-y divide-gray-200">
                                <tr className="bg-gray-50"><td className="p-4 font-bold text-gray-600 w-1/3">CPU</td><td className="p-4 text-gray-800">{product.specs[0]}</td></tr>
                                <tr><td className="p-4 font-bold text-gray-600">RAM</td><td className="p-4 text-gray-800">{product.specs[1]}</td></tr>
                                <tr className="bg-gray-50"><td className="p-4 font-bold text-gray-600">Ổ cứng</td><td className="p-4 text-gray-800">{product.specs[2]}</td></tr>
                                <tr><td className="p-4 font-bold text-gray-600">Màn hình</td><td className="p-4 text-gray-800">14.0 inch Full HD IPS</td></tr>
                                <tr className="bg-gray-50"><td className="p-4 font-bold text-gray-600">VGA</td><td className="p-4 text-gray-800">Intel UHD Graphics</td></tr>
                                <tr><td className="p-4 font-bold text-gray-600">Kết nối</td><td className="p-4 text-gray-800">HDMI, USB 3.0, Type-C</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Cột Phải: VIDEO REVIEW (Thay thế Yên tâm mua sắm) */}
            <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-[160px]">
                     <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <i className="fab fa-youtube text-red-600 mr-2 text-2xl"></i> Video Đánh Giá
                     </h3>
                     
                     {/* Khung Video Youtube */}
                     <div className="w-full aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-inner bg-black">
                        {product.video ? (
                            <iframe 
                                className="w-full h-full"
                                src={product.video} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                <i className="fab fa-youtube text-4xl mb-2 opacity-50"></i>
                                <span className="text-xs">Chưa có video review</span>
                            </div>
                        )}
                     </div>

                     <p className="text-xs text-gray-500 mt-3 text-center italic">
                        Video thực tế sản phẩm tại cửa hàng ILAP
                     </p>
                </div>
            </div>
        </div>

        {/* 4. SẢN PHẨM LIÊN QUAN */}
        <div className="mt-12">
            <h3 className="text-2xl font-black text-gray-800 uppercase mb-6 flex items-center">
                <span className="w-1.5 h-8 bg-primary mr-3 rounded-r-md"></span> Sản phẩm liên quan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.length > 0 ? (
                    relatedProducts.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                    <p className="text-gray-500 col-span-4 pl-4">Đang cập nhật thêm sản phẩm...</p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;