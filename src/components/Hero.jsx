import React from 'react';

const Hero = () => {
  return (
    // Thêm pt-48 (padding-top lớn) để đẩy nội dung xuống dưới Header
    // h-screen để ảnh full màn hình (hoặc min-h-[600px] tùy bạn)
    <section className="hero-bg relative pt-48 pb-32 text-center text-white mb-8 min-h-[700px] flex flex-col justify-center">
        
        {/* Lớp phủ đen mờ để menu trắng và chữ trắng nổi bật hơn */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-2xl uppercase tracking-tight">
                Kho Máy Tính Cũ Chất Lượng
            </h1>
            <p className="text-lg md:text-xl mb-12 opacity-90 font-light max-w-2xl mx-auto">
                Laptop Văn Phòng - PC Gaming - Linh Kiện Giá Tốt Nhất Đà Nẵng. <br/> Bảo hành dài hạn - Trả góp 0%.
            </p>

            {/* Search Box */}
            <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/20 max-w-4xl mx-auto shadow-2xl">
                <form className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5">
                        <input type="text" className="w-full h-[55px] px-5 rounded focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 bg-white" placeholder="Bạn cần tìm gì? (VD: Dell i5)..." />
                    </div>
                    <div className="md:col-span-3">
                        <select className="w-full h-[55px] px-4 rounded focus:outline-none text-gray-800 cursor-pointer bg-white border-r-8 border-transparent">
                            <option>Tất cả danh mục</option>
                            <option>Laptop</option>
                            <option>PC Gaming</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <select className="w-full h-[55px] px-4 rounded focus:outline-none text-gray-800 cursor-pointer bg-white border-r-8 border-transparent">
                            <option>Mức giá</option>
                            <option>Dưới 5tr</option>
                            <option>5 - 10tr</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <button className="w-full h-[55px] bg-primary hover:bg-primary-hover text-white font-bold uppercase rounded transition flex items-center justify-center shadow-lg hover:shadow-primary/50">
                            <i className="fas fa-search mr-2"></i> Tìm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
  );
};

export default Hero;