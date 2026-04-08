import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Kiểm tra: Chỉ áp dụng Header trong suốt khi ở Trang Chủ ('/')
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- LOGIC MÀU SẮC ---
  // Nếu (đã cuộn) HOẶC (không phải trang chủ) -> Nền trắng, chữ đen
  const isStickyOrNotHome = isScrolled || !isHomePage;

  const headerClass = isStickyOrNotHome 
      ? 'bg-white shadow-md text-gray-800' 
      : 'bg-transparent text-white';

  const topbarClass = isStickyOrNotHome
      ? 'bg-dark text-gray-400 border-gray-800' // Topbar luôn tối màu khi nền trắng để dễ nhìn
      : 'border-white/10 text-gray-300'; // Topbar mờ khi ở nền trong suốt

  const borderClass = isStickyOrNotHome ? 'border-gray-700' : 'border-white/20';
  const logoTextClass = isStickyOrNotHome ? 'text-black' : 'text-white';
  const navTextClass = isStickyOrNotHome ? 'text-gray-800' : 'text-white';

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerClass}`}>
      
      {/* TOP BAR */}
      <div className={`h-[46px] text-[13px] border-b transition-colors duration-300 ${topbarClass}`}>
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
            
            {/* CỤM BÊN TRÁI: FOLLOW US + ICONS */}
            <div className="flex items-center h-full">
                <span className="hidden sm:block uppercase font-bold tracking-wide mr-4 text-[11px]">Follow us</span>
                {/* 👇 ĐÂY LÀ PHẦN ICON BẠN BỊ MẤT 👇 */}
                <div className={`flex items-center border-l ${borderClass} pl-4 space-x-4`}>
                    <a href="#" className="hover:text-primary transition"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="hover:text-primary transition"><i className="fab fa-youtube"></i></a>
                    <a href="#" className="hover:text-primary transition"><i className="fab fa-tiktok"></i></a>
                </div>
            </div>

            {/* CỤM BÊN PHẢI: TÀI KHOẢN + SỐ ĐIỆN THOẠI */}
            <div className="flex items-center h-full">
                <a href="#" className="flex items-center gap-2 mr-6 hover:text-primary transition font-medium">
                    <i className="far fa-user"></i> <span>Tài khoản</span>
                </a>
                <a href="tel:0909909619" className={`flex items-center gap-2 pl-6 border-l ${borderClass} h-full font-bold hover:text-primary transition uppercase text-[11px] tracking-wide`}>
                    <i className="far fa-plus-square text-primary text-sm"></i> <span>Build PC Ngay</span>
                </a>
            </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="h-[90px]">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center">
                <h2 className={`text-3xl font-black tracking-tighter leading-none ${logoTextClass}`}>
                    ILAP<span className="text-primary">.</span>VN
                </h2>
            </Link>

            {/* MENU DESKTOP */}
            <nav className="hidden lg:block">
                <ul className="flex gap-8 xl:gap-10">
                    {['Home', 'Laptop', 'PC - Máy Bàn', 'Linh Kiện', 'Liên Hệ'].map((item) => (
                        <li key={item}>
                            <a href="#" className={`relative py-8 font-bold uppercase text-[13px] hover:text-primary transition group ${navTextClass}`}>
                                {item}
                                <span className="absolute bottom-0 left-1/2 w-0 h-[3px] bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ACTION ICONS */}
            <div className="flex items-center gap-4">
                <button className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition ${navTextClass} hover:bg-blue-50 hover:text-primary`}>
                    <i className="fas fa-search"></i>
                </button>
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-lg transition cursor-pointer ${navTextClass} hover:bg-blue-50 hover:text-primary`}>
                    <i className="far fa-heart"></i>
                    <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">0</span>
                </div>
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-lg transition cursor-pointer ${navTextClass} hover:bg-blue-50 hover:text-primary`}>
                    <i className="fas fa-shopping-basket"></i>
                    <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">2</span>
                </div>
            </div>
        </div>
      </header>
    </div>
  );
};

export default Header;