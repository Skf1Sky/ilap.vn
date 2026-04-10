import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

const ProductDetail = ({ products }) => {
  const { id } = useParams(); // id từ URL
  
  const [activeImage, setActiveImage] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({ customerName: '', phone: '', address: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Tìm sản phẩm trực tiếp từ state chung
  const product = products.find(p => p.id === id || p._id === id);
  
  // Tìm sản phẩm liên quan
  const relatedProducts = product 
    ? products.filter(p => p.category === product.category && (p.id !== product.id && p._id !== product._id)).slice(0, 4)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên cùng khi đổi trang
    if (product) {
       // Reset ảnh chính
       const firstImg = (product.images && product.images.length > 0) ? product.images[0] : product.image;
       setActiveImage(firstImg || '');
    }
  }, [product, id]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
        await api.post('/api/orders', {
            customerName: orderForm.customerName,
            phone: orderForm.phone,
            address: orderForm.address,
            items: [{
                productId: product._id || product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            }]
        });
        setOrderSuccess(true);
        setTimeout(() => {
            setShowOrderModal(false);
            setOrderSuccess(false);
            setOrderForm({ customerName: '', phone: '', address: '' });
        }, 3000);
    } catch (err) {
        alert("Lỗi kết nối. Vui lòng thử lại sau!");
    }
  };

  // Nếu chưa lấy được data (thường là lúc F5)
  if (!products || products.length === 0) {
    return <div className="min-h-screen flex items-center justify-center animate-pulse text-gray-500 font-bold">Đang tải thông tin sản phẩm...</div>;
  }

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

  // Sử dụng images từ MongoDB
  const galleryImages = (product.images && product.images.length > 0) ? product.images : [];

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
               <div className="grid grid-cols-4 gap-3 mt-4">
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

            {/* Cột Phải */}
            <div className="md:col-span-7">
               <h1 className="text-3xl font-black text-gray-800 mb-2 leading-tight">{product.name}</h1>
               <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                  <span className="bg-gray-100 px-2 py-1 rounded font-semibold text-gray-700">Đã bán: {product.sold || 0}</span>
                  {product.quantity > 0 && product.quantity < 5 ? (
                      <span className="text-red-500 font-bold animate-pulse"><i className="fas fa-exclamation-triangle mr-1"></i> Sắp hết hàng (Chỉ còn {product.quantity})</span>
                  ) : product.quantity > 0 ? (
                      <span className="text-emerald-600 font-bold"><i className="fas fa-check-circle mr-1"></i> Còn {product.quantity} sản phẩm</span>
                  ) : (
                      <span className="text-gray-400 font-bold line-through"><i className="fas fa-times-circle mr-1"></i> Hết hàng</span>
                  )}
               </div>
               <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-100 relative overflow-hidden">
                  <div className="text-3xl font-bold text-red-600 mb-2 flex items-end gap-3">
                     {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                     <span className="text-gray-400 text-lg font-normal line-through mb-1">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 1.2)}
                     </span>
                  </div>
               </div>

               {/* ... (Phần Quà tặng & Nút mua hàng giữ nguyên) ... */}
               <div className="border border-dashed border-red-300 bg-red-50/50 rounded-lg p-4 mb-8">
                  <h4 className="text-red-600 font-bold uppercase text-sm mb-3 flex items-center"><i className="fas fa-gift mr-2 text-lg"></i> Quà tặng & Ưu đãi</h4>
                  <ul className="text-sm space-y-2 text-gray-700 ml-1">
                     <li className="flex items-start"><i className="fas fa-check text-green-500 mt-1 mr-2"></i> Tặng Balo chống sốc cao cấp.</li>
                     <li className="flex items-start"><i className="fas fa-check text-green-500 mt-1 mr-2"></i> Tặng Chuột không dây Darue</li>
                  </ul>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                  <button disabled={product.quantity <= 0 && !product.inStock} onClick={() => setShowOrderModal(true)} className={`flex-1 text-white py-4 rounded-lg font-bold uppercase shadow-lg transition transform ${product.quantity > 0 || product.inStock ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30 hover:-translate-y-1' : 'bg-gray-400 cursor-not-allowed opacity-70'}`}>
                     <span className="block text-xl"><i className="fas fa-shopping-cart mr-2"></i> {product.quantity > 0 || product.inStock ? 'Đăng Ký Mua' : 'Hết Hàng Thời Điểm Này'}</span>
                     <span className="block text-xs font-normal opacity-80 mt-1">Để lại SĐT, iLap sẽ gọi điện chốt giá tốt nhất</span>
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* 3. THÔNG SỐ KỸ THUẬT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 uppercase border-l-4 border-primary pl-3">Thông số kỹ thuật</h3>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <tbody className="divide-y divide-gray-200">
                                {product.specs && product.specs.map((spec, index) => {
                                    const labels = product.category === 'laptop' 
                                        ? ['Vi xử lý (CPU)', 'RAM', 'Ổ cứng', 'Màn hình', 'Card đồ họa (VGA)', 'Dung lượng PIN']
                                        : ['Vi xử lý (CPU)', 'RAM', 'Ổ cứng', 'Mainboard', 'Card đồ họa (VGA)', 'Nguồn & Vỏ Case'];
                                    
                                    const specLabel = (typeof spec === 'object' && spec.name) ? spec.name : (labels[index] || `Thông số ${index + 1}`);
                                    const specValue = (typeof spec === 'object') ? spec.value : spec;

                                    return (
                                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                                            <td className="p-4 font-bold text-gray-600 w-1/3 text-xs uppercase tracking-wider">{specLabel}</td>
                                            <td className="p-4 text-gray-800 font-medium">{specValue}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Cột Phải: VIDEO */}
            <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-[160px]">
                     <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <i className="fab fa-youtube text-red-600 mr-2 text-2xl"></i> Video Đánh Giá
                     </h3>
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
                    relatedProducts.map(p => <ProductCard key={p._id} product={p} />)
                ) : (
                    <p className="text-gray-500 col-span-4 pl-4">Đang cập nhật thêm sản phẩm...</p>
                )}
            </div>
        </div>

      </div>
        {/* MODAL ĐẶT HÀNG */}
        {showOrderModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
               <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl relative animate-fadeIn">
                  <button onClick={() => setShowOrderModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                      <i className="fas fa-times text-xl"></i>
                  </button>
                  {orderSuccess ? (
                      <div className="text-center py-8">
                          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                             <i className="fas fa-check"></i>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">Đăng Ký Thành Công!</h3>
                          <p className="text-gray-600">iLap sẽ sớm liên hệ cho bạn qua SĐT để tư vấn và chốt giá thủ tục trong vòng ít phút nữa.</p>
                      </div>
                  ) : (
                      <form onSubmit={handleOrderSubmit}>
                          <h3 className="text-2xl font-black text-gray-800 uppercase mb-2 border-b pb-4">
                              <i className="fas fa-bolt text-red-500 mr-2"></i>Mua Nhanh
                          </h3>
                          <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 mb-6">
                              <img src={activeImage} className="w-12 h-12 object-contain" alt="sp" />
                              <div className="text-sm font-bold text-gray-800 line-clamp-2">{product.name}</div>
                          </div>
                          <div className="space-y-4 mb-8">
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên của bạn*</label>
                                  <input required value={orderForm.customerName} onChange={e => setOrderForm({...orderForm, customerName: e.target.value})} type="text" className="w-full border-b-2 border-gray-300 px-2 py-2 focus:border-red-500 outline-none transition bg-transparent" placeholder="VD: Anh Nam" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số điện thoại*</label>
                                  <input required value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} type="tel" className="w-full border-b-2 border-gray-300 px-2 py-2 focus:border-red-500 outline-none transition bg-transparent font-bold text-lg tracking-widest text-blue-800" placeholder="09xxxxxxxx" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ nhận hàng*</label>
                                  <input required value={orderForm.address} onChange={e => setOrderForm({...orderForm, address: e.target.value})} type="text" className="w-full border-b-2 border-gray-300 px-2 py-2 focus:border-red-500 outline-none transition bg-transparent" placeholder="Số nhà, Đường, Quận/Huyện, Tỉnh/TP" />
                              </div>
                          </div>
                          <button type="submit" className="w-full bg-red-600 text-white font-bold uppercase text-lg py-3 rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-200">
                             Gửi Đăng Ký
                          </button>
                      </form>
                  )}
               </div>
            </div>
        )}
    </div>
  );
};

export default ProductDetail;