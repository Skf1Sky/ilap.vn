import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[110] shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-black uppercase flex items-center">
            <i className="fas fa-shopping-basket text-primary mr-2"></i> Giỏ Hàng ({cartCount})
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <i className="fas fa-box-open text-5xl mb-4 opacity-50"></i>
              <p>Giỏ hàng của bạn đang trống</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border border-gray-100 p-3 rounded-lg relative group">
                  <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-2 pr-6">{item.name}</h4>
                      <p className="text-red-600 font-bold text-sm mt-1">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                        >
                          <i className="fas fa-minus text-[10px]"></i>
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                        >
                          <i className="fas fa-plus text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition p-1"
                    title="Xóa"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Tổng tiền:</span>
              <span className="text-xl font-black text-red-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
              </span>
            </div>
            <button 
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full bg-red-600 text-white font-bold uppercase py-3 rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <i className="fas fa-check-circle"></i> Thanh toán ngay
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
