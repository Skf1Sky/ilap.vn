import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-gray-400 text-[14px]">

            {/* --- FOOTER TOP --- */}
            <div className="py-16 border-b border-gray-800">
                <div className="max-w-[1760px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                        {/* Cột 1: Logo & Giới thiệu */}
                        <div>
                            <a href="#" className="block mb-6">
                                <h2 className="text-3xl font-black text-white tracking-tighter">ILAP<span className="text-primary">.</span>VN</h2>
                            </a>
                            <p className="leading-relaxed opacity-80 mb-6">
                                Chuyên cung cấp Laptop cũ, PC Gaming và Linh kiện máy tính chính hãng tại Đà Nẵng. Uy tín tạo nên thương hiệu.
                            </p>
                        </div>

                        {/* Cột 2: Danh mục Hot */}
                        <div>
                            <h5 className="text-white text-lg font-bold uppercase tracking-wide mb-6">Danh Mục Hot</h5>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#laptop-zone" className="block py-1 hover:text-primary hover:translate-x-1 transition-all duration-300">
                                        <i className="fas fa-angle-right text-xs mr-2"></i> Laptop
                                    </a>
                                </li>
                                <li>
                                    <a href="#pc-zone" className="block py-1 hover:text-primary hover:translate-x-1 transition-all duration-300">
                                        <i className="fas fa-angle-right text-xs mr-2"></i> PC Gaming - Đồ Họa
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="block py-1 hover:text-primary hover:translate-x-1 transition-all duration-300">
                                        <i className="fas fa-angle-right text-xs mr-2"></i> Linh Kiện Máy Tính
                                    </a>
                                </li>
                                <li>
                                    <a href="/warranty" className="block py-1 hover:text-primary hover:translate-x-1 transition-all duration-300">
                                        <i className="fas fa-angle-right text-xs mr-2"></i> Tra cứu bảo hành
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Cột 3: Liên Hệ & Tin Tức */}
                        <div>
                            <h5 className="text-white text-lg font-bold uppercase tracking-wide mb-6">Liên Hệ & Tin Tức</h5>
                            <div className="mb-6 space-y-4">
                                <p className="flex items-start">
                                    <i className="fas fa-map-marker-alt text-primary mt-1 w-6"></i>
                                    <span>53 Chu Mạnh Trinh, Đà Nẵng</span>
                                </p>
                                <p className="flex items-center">
                                    <a href="mailto:contact@ilap.vn" className="flex items-center hover:text-white transition">
                                        <i className="fas fa-envelope text-primary w-6"></i>
                                        <span>contact@ilap.vn</span>
                                    </a>
                                </p>
                            </div>

                            {/* Form đăng ký */}
                            <form className="flex">
                                <input
                                    type="email"
                                    placeholder="Email của bạn..."
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary text-sm border border-gray-700"
                                />
                                <button className="bg-primary hover:bg-primary-hover text-white px-5 rounded-r-md transition">
                                    <i className="far fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>

                        {/* Cột 4: Liên Kết */}
                        <div className="md:col-span-1">
                            <h5 className="text-white text-lg font-bold uppercase tracking-wide mb-6 relative">
                                Bản Đồ Chỉ Đường
                                <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary rounded-full translate-y-2"></span>
                            </h5>

                            <div className="rounded-lg overflow-hidden border-2 border-gray-700 hover:border-primary transition-colors duration-300 shadow-lg h-[200px]">
                                <iframe
                                    /* 👇 ĐÂY LÀ LINK ĐÃ CHỈNH CHO 53 CHU MẠNH TRINH */
                                    src="https://maps.google.com/maps?q=53%20Chu%20Mạnh%20Trinh,%20Đà%20Nẵng&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Bản đồ 53 Chu Mạnh Trinh"
                                ></iframe>
                            </div>

                            <div className="mt-3 flex items-start space-x-2 text-gray-400 text-sm">
                                <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                                <span>53 Chu Mạnh Trinh, TP. Đà Nẵng</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- FOOTER BOTTOM --- */}
            <div className="bg-black/40 py-6">
                <div className="max-w-[1760px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Copyright */}
                        <div className="text-center md:text-left text-gray-500">
                            <p>&copy; 2024 <a href="#" className="text-white font-bold hover:text-primary transition">ILap.vn</a>, All Rights Reserved.</p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-6 text-lg">
                            <a href="https://www.facebook.com/profile.php?id=61583438160634" target="_blank" title="Facebook" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white transition duration-300">
                                <i className="fab fa-facebook-f text-sm"></i>
                            </a>
                            <a href="#" target="_blank" title="Youtube" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#FF0000] hover:text-white transition duration-300">
                                <i className="fab fa-youtube text-sm"></i>
                            </a>
                            <a href="#" target="_blank" title="Tiktok" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border hover:border-white transition duration-300">
                                <i className="fab fa-tiktok text-sm"></i>
                            </a>
                            <a href="https://zalo.me/0909909619" target="_blank" title="Zalo" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0068FF] hover:text-white transition duration-300">
                                <i className="fas fa-comment-dots text-sm"></i>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;