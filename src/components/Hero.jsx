import React from 'react';

const Hero = () => {
  return (
    <section className="hero-bg relative pt-48 pb-32 text-center text-white mb-8 min-h-[750px] flex flex-col justify-center">
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl uppercase tracking-tighter">
                Kho Máy Tính Cũ <span className="text-primary italic">Chất Lượng</span>
            </h1>
            <p className="text-lg md:text-2xl mb-12 opacity-95 font-medium max-w-2xl mx-auto leading-relaxed">
                Laptop Văn Phòng - PC Gaming - Linh Kiện <br/> Giá Tốt Nhất Đà Nẵng. <br/>
                <span className="text-sm uppercase tracking-widest font-black text-primary bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm inline-block mt-4">
                  Bảo hành dài hạn - Trả góp 0%
                </span>
                <span className="block mt-2 text-[10px] uppercase tracking-widest opacity-30">
                  Deploy v1.1 - GitAction Test Active
                </span>
            </p>

            {/* Search Box - Soft \u0026 Modern Glass */}
            <div className="bg-white/10 backdrop-blur-xl p-3 md:p-3 rounded-[40px] border border-white/20 max-w-5xl mx-auto shadow-2xl animate-fade-in-up">
                <form className="grid grid-cols-1 md:grid-cols-12 gap-2 p-1 bg-white rounded-[35px] shadow-inner overflow-hidden">
                    <div className="md:col-span-5 relative group">
                        <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"></i>
                        <input 
                          type="text" 
                          className="w-full h-[65px] pl-14 pr-6 text-gray-800 bg-transparent outline-none transition-all placeholder-gray-400 font-medium" 
                          placeholder="Bạn cần tìm gì? (VD: Dell i5)..." 
                        />
                    </div>
                    <div className="md:col-span-3 border-l border-gray-100 hidden md:block">
                        <select className="w-full h-[65px] px-5 outline-none text-gray-600 cursor-pointer bg-transparent border-none appearance-none font-semibold text-sm">
                            <option>Tất cả danh mục</option>
                            <option>Laptop Cũ</option>
                            <option>PC Gaming</option>
                            <option>Linh Kiện</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 border-l border-gray-100 hidden md:block">
                        <select className="w-full h-[65px] px-5 outline-none text-gray-600 cursor-pointer bg-transparent border-none appearance-none font-semibold text-sm">
                            <option>Mức giá</option>
                            <option>Dưới 5tr</option>
                            <option>5 - 10tr</option>
                            <option>10 - 20tr</option>
                            <option>Trên 20tr</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <button className="w-full h-[65px] bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-widest transition-all rounded-[30px] shadow-lg flex items-center justify-center gap-2 active:scale-95">
                            Tìm kiếm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
  );
};

export default Hero;