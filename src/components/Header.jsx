import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const headerClass = 'bg-[#0f0f0f] border-b border-white/5 shadow-2xl text-white';
  const topbarClass = 'bg-black text-gray-400 border-gray-800';
  const borderClass = 'border-gray-800';
  const logoTextClass = 'text-white';
  const navTextClass = 'text-gray-300';

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerClass}`}>
      
      {/* TOP BAR */}
      <div className={`h-[38px] text-[12px] border-b transition-colors duration-300 ${topbarClass}`}>
        <div className="max-w-[1760px] mx-auto px-6 h-full flex justify-between items-center">
            
            {/* CỤM BÊN TRÁI: THEO DÕI TẠI + ICONS */}
            <div className="flex items-center h-full">
                <span className="hidden sm:block uppercase font-bold tracking-[0.1em] text-[10px] mr-5 opacity-70">Theo dõi tại</span>
                <div className={`flex items-center border-l ${borderClass} pl-5 space-x-5`}>
                    <a href="#" className="hover:text-primary hover:drop-shadow-[0_0_8px_#1e90ff] transition-all"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="hover:text-primary hover:drop-shadow-[0_0_8px_#1e90ff] transition-all"><i className="fab fa-youtube"></i></a>
                    <a href="#" className="hover:text-primary hover:drop-shadow-[0_0_8px_#1e90ff] transition-all"><i className="fab fa-tiktok"></i></a>
                </div>
            </div>

            {/* CỤM BÊN PHẢI: TÀI KHOẢN + SỐ ĐIỆN THOẠI */}
            <div className="flex items-center h-full">
                <a href="#" className="flex items-center gap-2 mr-6 hover:text-white transition font-medium">
                    <i className="far fa-user text-[13px]"></i> <span>Tài khoản</span>
                </a>
                <a href="tel:0909909619" className={`flex items-center gap-2 pl-6 border-l ${borderClass} h-full font-bold text-primary hover:text-white hover:drop-shadow-[0_0_10px_#1e90ff] transition-all uppercase text-[11px] tracking-wide`}>
                    <i className="far fa-plus-square text-sm"></i> <span>Build PC Ngay</span>
                </a>
            </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="h-[74px]">
        <div className="max-w-[1760px] mx-auto px-6 h-full flex items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center">
                <h2 className={`text-3xl font-black tracking-tighter leading-none ${logoTextClass}`}>
                    ILAP<span className="text-primary">.</span>VN
                </h2>
            </Link>

            {/* MENU DESKTOP */}
            <nav className="hidden lg:block ml-8">
                <ul className="flex gap-8 xl:gap-12">
                    {[
                      { name: 'Trang chủ', path: '/' },
                      { name: 'Laptop', path: '/laptops' },
                      { name: 'PC - Máy Bàn', path: '/pcs' },
                      { name: 'Linh Kiện', path: '/linhkien' },
                      { name: 'Bảo hành', path: '/warranty' },
                      { name: 'Liên Hệ', path: '/contact' }
                    ].map((item) => (
                        <li key={item.name} className="h-[74px] flex items-center">
                            <Link to={item.path} className={`relative font-bold uppercase text-[12px] tracking-[0.05em] hover:text-white transition-colors group ${navTextClass}`}>
                                {item.name}
                                <span className="absolute -bottom-[28px] left-1/2 w-0 h-[3px] shadow-[0_0_8px_#1e90ff] bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-t-lg"></span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ACTION ICONS */}
            <div className="flex items-center gap-3">
                <button className={`w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[15px] transition-all hover:bg-primary hover:border-primary hover:text-white hover:shadow-[0_0_15px_rgba(30,144,255,0.5)] active:scale-95 text-gray-300`}>
                    <i className="fas fa-search"></i>
                </button>
                <div className={`relative w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[15px] transition-all cursor-pointer hover:bg-primary hover:border-primary hover:text-white hover:shadow-[0_0_15px_rgba(30,144,255,0.5)] active:scale-95 text-gray-300`}>
                    <i className="far fa-heart"></i>
                    <span className="absolute -top-1 -right-1 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
                </div>
                <div 
                  onClick={() => setIsCartOpen(true)}
                  className={`relative w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[15px] transition-all cursor-pointer hover:bg-primary hover:border-primary hover:text-white hover:shadow-[0_0_15px_rgba(30,144,255,0.5)] active:scale-95 text-gray-300`}
                >
                    <i className="fas fa-shopping-basket"></i>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                </div>
            </div>
        </div>
      </header>
    </div>
  );
};

export default Header;