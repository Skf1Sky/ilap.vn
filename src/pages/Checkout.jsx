import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        note: form.note,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: cartTotal
      };

      await api.post('/api/orders', orderData);
      
      setOrderSuccess(true);
      clearCart();
      
      setTimeout(() => {
        navigate('/');
      }, 5000);
      
    } catch (err) {
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 pt-[150px] pb-20 px-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            <i className="fas fa-check"></i>
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-3">Đặt Hàng Thành Công!</h2>
          <p className="text-gray-600 mb-8">Cảm ơn bạn đã mua sắm tại ILAP.VN. Chúng tôi sẽ sớm liên hệ qua số điện thoại để xác nhận đơn hàng.</p>
          <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold uppercase hover:bg-primary-hover transition shadow-lg shadow-primary/30">
            Quay Về Trang Chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-[150px] pb-20">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <h1 className="text-3xl font-black text-gray-800 uppercase mb-8 flex items-center">
          <span className="w-1.5 h-8 bg-primary mr-3 rounded-r-md"></span> Thanh Toán
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm text-center">
            <i className="fas fa-shopping-basket text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-bold text-gray-600 mb-6">Giỏ hàng của bạn đang trống</h2>
            <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold uppercase hover:bg-primary-hover transition shadow-lg shadow-primary/30">
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form thông tin */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Thông Tin Nhận Hàng</h3>
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Họ và tên *</label>
                      <input 
                        type="text" 
                        name="customerName"
                        required
                        value={form.customerName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Số điện thoại *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition font-semibold"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Địa chỉ giao hàng *</label>
                    <input 
                      type="text" 
                      name="address"
                      required
                      value={form.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                      placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Ghi chú (Tùy chọn)</label>
                    <textarea 
                      name="note"
                      rows="3"
                      value={form.note}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none"
                      placeholder="Ghi chú thêm về đơn hàng..."
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 sticky top-[150px]">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Đơn Hàng Của Bạn</h3>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-1">{item.name}</h4>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">SL: {item.quantity}</span>
                          <span className="font-bold text-gray-800">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-emerald-600 font-medium">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                    <span className="font-bold text-gray-800">Tổng cộng</span>
                    <span className="text-2xl font-black text-red-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
                    </span>
                  </div>
                </div>

                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-lg font-bold uppercase text-lg transition-all shadow-lg flex justify-center items-center gap-2 ${
                    isSubmitting 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30'
                  }`}
                >
                  {isSubmitting ? (
                    <><i className="fas fa-spinner fa-spin"></i> Đang xử lý...</>
                  ) : (
                    <><i className="fas fa-check-circle"></i> Đặt Hàng Ngay</>
                  )}
                </button>
                <p className="text-xs text-center text-gray-500 mt-4">
                  Nhấn "Đặt Hàng Ngay" đồng nghĩa với việc bạn đồng ý với điều khoản của ILAP.VN
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
