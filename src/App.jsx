import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';

// 1. DỮ LIỆU GIẢ (Giữ nguyên như cũ)
const PRODUCTS = [
  // --- LAPTOP DATA ---
  { id: 1, name: "Dell XPS 13 9360", image: "https://laptop88.vn/media/product/pro_poster_4119.jpg", price: 10500000, discount: "Giảm 500K", subtitle: "Vỏ nhôm - Siêu mỏng", specs: ["i5-8250U", "8GB", "256GB"], category: "laptop" },
  { id: 2, name: "HP Envy 13 Gold", image: "https://cdn.tgdd.vn/Products/Images/44/231244/hp-envy-13-ba1027tu-i5-2k0b1pa-18-600x600.jpg", price: 11200000, discount: null, subtitle: "Sang trọng - Loa hay", specs: ["i7-8565U", "8GB", "512GB"], category: "laptop" },
  { id: 3, name: "ThinkPad T480s", image: "https://mac24h.vn/images/detailed/45/ThinkPad_T480s_mac24h.jpg", price: 7900000, discount: "Mới về", subtitle: "Bền bỉ - Phím ngon", specs: ["i5-8350U", "16GB", "256GB"], category: "laptop" },
  { id: 4, name: "Asus VivoBook A515", image: "https://cdn.tgdd.vn/Products/Images/44/253997/asus-vivobook-a515ea-i5-l12032t-271021-024502-600x600.jpg", price: 9500000, discount: null, subtitle: "Màn 15.6 - Trẻ trung", specs: ["i5-1135G7", "8GB", "512GB"], category: "laptop" },
  { id: 5, name: "MacBook Air M1", image: "https://cdn.tgdd.vn/Products/Images/44/231244/hp-envy-13-ba1027tu-i5-2k0b1pa-18-600x600.jpg", price: 15500000, discount: "Hot", subtitle: "Pin trâu - Màn đẹp", specs: ["M1", "8GB", "256GB"], category: "laptop" },
  { id: 6, name: "Dell Latitude 7490", image: "https://laptop88.vn/media/product/pro_poster_4119.jpg", price: 8500000, discount: null, subtitle: "Siêu bền doanh nhân", specs: ["i7-8650U", "8GB", "256GB"], category: "laptop" },
  { id: 7, name: "HP Elitebook 840 G6", image: "https://cdn.tgdd.vn/Products/Images/44/231244/hp-envy-13-ba1027tu-i5-2k0b1pa-18-600x600.jpg", price: 9200000, discount: null, subtitle: "Mỏng nhẹ thời trang", specs: ["i5-8365U", "16GB", "512GB"], category: "laptop" },
  { id: 8, name: "Lenovo Ideapad 5", image: "https://mac24h.vn/images/detailed/45/ThinkPad_T480s_mac24h.jpg", price: 10900000, discount: "Sale", subtitle: "Cấu hình cao", specs: ["Ryzen 5", "16GB", "512GB"], category: "laptop" },
  { id: 9, name: "Acer Nitro 5", image: "https://cdn.tgdd.vn/Products/Images/44/253997/asus-vivobook-a515ea-i5-l12032t-271021-024502-600x600.jpg", price: 14500000, discount: "Gaming", subtitle: "Chiến game ngon", specs: ["i5-11400H", "8GB", "GTX 1650"], category: "laptop" },
  { id: 10, name: "MSI Modern 14", image: "https://laptop88.vn/media/product/pro_poster_4119.jpg", price: 9900000, discount: null, subtitle: "Nhỏ gọn 1.3kg", specs: ["i3-1115G4", "8GB", "256GB"], category: "laptop" },
  { id: 11, name: "Surface Laptop 3", image: "https://cdn.tgdd.vn/Products/Images/44/231244/hp-envy-13-ba1027tu-i5-2k0b1pa-18-600x600.jpg", price: 12500000, discount: null, subtitle: "Màn cảm ứng 2K", specs: ["i5-1035G7", "8GB", "256GB"], category: "laptop" },
  { id: 12, name: "Dell Precision 5530", image: "https://mac24h.vn/images/detailed/45/ThinkPad_T480s_mac24h.jpg", price: 18500000, discount: "VIP", subtitle: "Máy trạm di động", specs: ["i7-8850H", "32GB", "P2000"], category: "laptop" },

  // --- PC DATA ---
  { id: 13, name: "PC Gaming Quốc Dân", image: "https://product.hstatic.net/1000026716/product/pc_gaming_h510m_i3_10105f_8gb_256gb_gtx_1650_4gb_white_8b2e1e90d1924559869502758c5c7969.jpg", price: 7200000, discount: "HOT", subtitle: "Chiến Game Online", specs: ["i3-10105F", "8GB", "GTX 1650"], category: "pc" },
  { id: 14, name: "PC Streamer Pro", image: "https://nguyencongpc.vn/media/product/22668-pc-streamer-i5-12400-16gb-3060.jpg", price: 15500000, discount: null, subtitle: "Vừa chơi vừa Live", specs: ["i5-12400F", "16GB", "RTX 3060"], category: "pc" },
  { id: 15, name: "PC Văn Phòng Dell", image: "https://product.hstatic.net/1000026716/product/pc_gaming_h510m_i3_10105f_8gb_256gb_gtx_1650_4gb_white_8b2e1e90d1924559869502758c5c7969.jpg", price: 3500000, discount: null, subtitle: "Đồng bộ bền bỉ", specs: ["i5-7500", "8GB", "SSD 240G"], category: "pc" },
  { id: 16, name: "PC Đồ Họa Render", image: "https://nguyencongpc.vn/media/product/22668-pc-streamer-i5-12400-16gb-3060.jpg", price: 18900000, discount: null, subtitle: "Render 4K Mượt", specs: ["i7-10700K", "32GB", "Quadro"], category: "pc" },
  { id: 17, name: "PC Gaming i5 12400F", image: "https://product.hstatic.net/1000026716/product/pc_gaming_h510m_i3_10105f_8gb_256gb_gtx_1650_4gb_white_8b2e1e90d1924559869502758c5c7969.jpg", price: 12500000, discount: "Best", subtitle: "Cấu hình quốc dân", specs: ["i5-12400F", "16GB", "RX 6600"], category: "pc" },
  { id: 18, name: "PC Workstation Xeon", image: "https://nguyencongpc.vn/media/product/22668-pc-streamer-i5-12400-16gb-3060.jpg", price: 25000000, discount: null, subtitle: "Cày kéo 24/7", specs: ["Dual Xeon", "64GB", "K4000"], category: "pc" },
  { id: 19, name: "PC Gaming Pink", image: "https://product.hstatic.net/1000026716/product/pc_gaming_h510m_i3_10105f_8gb_256gb_gtx_1650_4gb_white_8b2e1e90d1924559869502758c5c7969.jpg", price: 9500000, discount: "Cute", subtitle: "Case hồng cá tính", specs: ["i3-12100F", "16GB", "1660S"], category: "pc" },
  { id: 20, name: "PC All in One", image: "https://nguyencongpc.vn/media/product/22668-pc-streamer-i5-12400-16gb-3060.jpg", price: 6800000, discount: null, subtitle: "Gọn gàng hiện đại", specs: ["i5-9500T", "8GB", "24 inch"], category: "pc" },
  { id: 21, name: "PC Mini", image: "https://product.hstatic.net/1000026716/product/pc_gaming_h510m_i3_10105f_8gb_256gb_gtx_1650_4gb_white_8b2e1e90d1924559869502758c5c7969.jpg", price: 4500000, discount: null, subtitle: "Siêu nhỏ gọn", specs: ["i5-8500T", "8GB", "NVMe"], category: "pc" },
  { id: 22, name: "PC High End", image: "https://nguyencongpc.vn/media/product/22668-pc-streamer-i5-12400-16gb-3060.jpg", price: 45000000, discount: "New", subtitle: "Cân mọi Game AAA", specs: ["i9-13900K", "32GB", "RTX 4080"], category: "pc" },
  { id: 23, name: "PC Editor", image: "https://product.hstatic.net/1000026716/product/pc_gaming_h510m_i3_10105f_8gb_256gb_gtx_1650_4gb_white_8b2e1e90d1924559869502758c5c7969.jpg", price: 22000000, discount: null, subtitle: "Chuyên dựng phim", specs: ["i7-12700K", "32GB", "3060Ti"], category: "pc" },
  { id: 24, name: "PC Silent", image: "https://nguyencongpc.vn/media/product/22668-pc-streamer-i5-12400-16gb-3060.jpg", price: 11000000, discount: null, subtitle: "Không tiếng ồn", specs: ["i5-10400", "16GB", "Silent"], category: "pc" },
];

function App() {
  const allLaptops = PRODUCTS.filter(p => p.category === 'laptop');
  const allPCs = PRODUCTS.filter(p => p.category === 'pc');

  const [visibleLaptops, setVisibleLaptops] = useState(4);
  const [visiblePCs, setVisiblePCs] = useState(4);
  const INCREMENT = 4;
  const MAX_DISPLAY = 12;

  const handleToggleLaptop = () => {
    if (visibleLaptops >= MAX_DISPLAY || visibleLaptops >= allLaptops.length) {
        setVisibleLaptops(4);
    } else {
        setVisibleLaptops(prev => prev + INCREMENT);
    }
  };

  const handleTogglePC = () => {
    if (visiblePCs >= MAX_DISPLAY || visiblePCs >= allPCs.length) {
        setVisiblePCs(4);
    } else {
        setVisiblePCs(prev => prev + INCREMENT);
    }
  };

  return (
    <div className="font-sans text-gray-700 bg-gray-50">
      <Header />
      <Hero />
      
      {/* ================= LAPTOP ZONE ================= */}
      {/* Có -mt-24 để chồng lên Hero */}
      <section className="relative z-20 px-4 -mt-24 pb-16"> 
        <div className="container mx-auto">
          
          <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-6 mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary text-xl">
                    <i className="fas fa-laptop"></i>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Best Seller</span>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight">
                      Laptop Cũ Nổi Bật
                    </h2>
                  </div>
               </div>
               
               <div className="mt-4 md:mt-0">
                  <a href="#" className="flex items-center text-sm font-bold text-gray-500 hover:text-primary transition group">
                      Xem tất cả <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </a>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allLaptops.slice(0, visibleLaptops).map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            <div className="text-center mt-10">
                <button 
                    onClick={handleToggleLaptop}
                    className="px-8 py-2.5 border border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition duration-300 group shadow-sm hover:shadow-md"
                >
                    {(visibleLaptops >= MAX_DISPLAY || visibleLaptops >= allLaptops.length) ? (
                        <span>Thu gọn <i className="fas fa-chevron-up ml-2"></i></span>
                    ) : (
                        <span>Xem thêm Laptop <i className="fas fa-chevron-down ml-2 group-hover:translate-y-1 transition-transform"></i></span>
                    )}
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PC ZONE ================= */}
      {/* KHÔNG CÓ -mt-24, nằm bình thường bên dưới, nhưng vẫn dùng style Card trắng nổi lên */}
      <section className="px-4 pb-16">
        <div className="container mx-auto">
          
          {/* Style thẻ y hệt Laptop (bg-white, shadow, rounded...) */}
          <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 border border-gray-100">
            
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-6 mb-8">
               <div className="flex items-center gap-4">
                  {/* Đổi icon thành Desktop */}
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary text-xl">
                    <i className="fas fa-desktop"></i>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">High Performance</span>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight">
                      PC Gaming & Đồ Họa
                    </h2>
                  </div>
               </div>

               <div className="mt-4 md:mt-0">
                  <a href="#" className="flex items-center text-sm font-bold text-gray-500 hover:text-primary transition group">
                      Xem tất cả <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </a>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allPCs.slice(0, visiblePCs).map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            <div className="text-center mt-12">
                <button 
                    onClick={handleTogglePC}
                    className="px-8 py-2.5 border border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition duration-300 group shadow-sm hover:shadow-md"
                >
                    {(visiblePCs >= MAX_DISPLAY || visiblePCs >= allPCs.length) ? (
                        <span>Thu gọn <i className="fas fa-chevron-up ml-2"></i></span>
                    ) : (
                        <span>Xem thêm PC <i className="fas fa-chevron-down ml-2 group-hover:translate-y-1 transition-transform"></i></span>
                    )}
                </button>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;