import React from 'react';

const Hero = () => {
    return (
        <section className="hero-bg relative pt-32 pb-24 text-center text-white mb-20 min-h-[600px] flex flex-col justify-center mt-[112px]">

            <div className="absolute inset-0 bg-black/75 z-0"></div>

            <div className="max-w-[1760px] mx-auto px-6 relative z-10 w-full">
                <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl uppercase tracking-tighter">
                    Kho Máy Tính Cũ <span className="text-primary tracking-normal ml-2">Chất Lượng</span>
                </h1>
                <p className="text-lg md:text-xl mb-10 opacity-80 font-medium max-w-2xl mx-auto leading-relaxed">
                    Laptop Văn Phòng - PC Gaming - Linh Kiện <br /> Giá Tốt Nhất Đà Nẵng. <br />
                    <span className="text-sm uppercase tracking-[0.2em] font-black text-white bg-primary/20 px-5 py-2 rounded-full backdrop-blur-md inline-block mt-6 border border-primary/30 shadow-[0_0_15px_rgba(30,144,255,0.3)]">
                        Bảo hành dài hạn - Trả góp 0%
                    </span>
                </p>


                {/* Search Box - Soft \u0026 Modern Glass */}
                <div className="bg-white/10 backdrop-blur-2xl p-3 md:p-3 rounded-[35px] border border-white/10 max-w-4xl mx-auto shadow-2xl animate-fade-in-up">
                    <form className="grid grid-cols-1 md:grid-cols-12 gap-2 p-1.5 bg-white rounded-[30px] shadow-inner overflow-hidden">
                        <div className="md:col-span-6 relative group">
                            <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"></i>
                            <input
                                type="text"
                                className="w-full h-[60px] pl-14 pr-6 text-gray-800 bg-transparent outline-none transition-all placeholder-gray-400 font-medium text-[15px]"
                                placeholder="Bạn cần tìm máy gì? (VD: Dell i5)..."
                            />
                        </div>
                        <div className="md:col-span-3 border-l border-gray-100 hidden md:block">
                            <select className="w-full h-[60px] px-6 outline-none text-gray-600 cursor-pointer bg-transparent border-none appearance-none font-semibold text-[14px]">
                                <option>Tất cả danh mục</option>
                                <option>Laptop Cũ</option>
                                <option>PC Gaming</option>
                                <option>Linh Kiện</option>
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <button className="w-full h-[60px] bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-[0.1em] text-[13px] transition-all rounded-[25px] flex items-center justify-center gap-2 active:scale-95 shadow-[0_4px_15px_rgba(30,144,255,0.4)]">
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