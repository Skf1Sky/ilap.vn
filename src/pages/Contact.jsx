import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-[150px]">
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-200 py-3 shadow-sm mb-8">
        <div className="container mx-auto px-4 text-sm text-gray-500 flex items-center">
            <Link to="/" className="hover:text-primary transition-colors">
                <i className="fas fa-home mr-1"></i> Trang chủ
            </Link> 
            <span className="mx-2 text-gray-300">/</span> 
            <span className="uppercase font-bold text-gray-800">Liên hệ & Bảo hành</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* CỘT TRÁI: THÔNG TIN CÔNG TY & LỜI CẢM ƠN */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <h1 className="text-3xl font-black text-gray-800 mb-6 uppercase flex items-center">
                <i className="fas fa-envelope-open-text text-primary mr-4 text-4xl"></i> 
                ILAP.VN
              </h1>
              
              <div className="prose text-gray-600 mb-8 max-w-none">
                <p className="text-lg leading-relaxed">
                  Thay mặt toàn thể đội ngũ <strong>ILAP.VN</strong>, chúng tôi xin gửi lời cảm ơn chân thành và sâu sắc nhất đến Quý khách hàng đã tin tưởng lựa chọn sản phẩm của chúng tôi. 
                  Sự đồng hành của Quý khách là động lực to lớn giúp ILAP không ngừng hoàn thiện và mang đến những dàn máy PC, Laptop chất lượng tuyệt đối.
                </p>
                <p className="mt-4 font-medium text-gray-800 italic">
                  "Chất lượng thật - Giá trị thật - Đồng hành trọn đời."
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 font-bold uppercase">Địa chỉ cửa hàng</p>
                    <p className="text-gray-800 font-medium">Bình Dương (Vui lòng gọi trước khi đến)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 font-bold uppercase">Hotline Hỗ trợ</p>
                    <p className="text-gray-800 font-medium text-lg tracking-wider">09XXXXXXXX (Cập nhật sau)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CHÍNH SÁCH BẢO HÀNH */}
          <div>
            <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-2xl shadow-lg p-8 text-white h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="fas fa-shield-alt text-9xl"></i>
              </div>
              
              <h2 className="text-2xl font-black mb-8 uppercase flex items-center relative z-10">
                <span className="w-2 h-8 bg-red-500 mr-3 rounded-full"></span> 
                Quyền Lợi & Bảo Hành
              </h2>

              <p className="text-indigo-100 mb-8 relative z-10">
                Chúng tôi cung cấp các tùy chọn bảo hành linh hoạt, đảm bảo máy móc hoạt động ổn định và hỗ trợ kỹ thuật dài lâu.
              </p>

              <div className="space-y-6 relative z-10">
                {/* Gói 1 Tháng */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/20 transition cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold flex items-center text-yellow-400">
                      <i className="fas fa-medal mr-2"></i> Gói Cơ Bản 1 Tháng
                    </h3>
                  </div>
                  <ul className="text-sm text-indigo-100 space-y-2 mt-3 ml-2">
                    <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2 text-xs"></i> Lỗi 1 đổi 1 trong 7 ngày đầu tiên.</li>
                    <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2 text-xs"></i> Bảo hành toàn bộ phần cứng 30 ngày.</li>
                    <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2 text-xs"></i> Hỗ trợ cài đặt phần mềm miễn phí 1 năm.</li>
                  </ul>
                </div>

                {/* Gói 3 Tháng */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 border border-red-500 rounded-xl p-5 hover:from-red-500 hover:to-red-600 transition cursor-default shadow-xl shadow-red-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold flex items-center text-white">
                      <i className="fas fa-crown mr-2"></i> Gói An Tâm 3 Tháng
                    </h3>
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded uppercase">Khuyên Dùng</span>
                  </div>
                  <ul className="text-sm text-red-100 space-y-2 mt-3 ml-2">
                    <li className="flex items-center"><i className="fas fa-check text-white mr-2 text-xs"></i> Lỗi 1 đổi 1 trong 15 ngày đầu tiên.</li>
                    <li className="flex items-center"><i className="fas fa-check text-white mr-2 text-xs"></i> Bảo hành toàn phần cứng 90 ngày.</li>
                    <li className="flex items-center"><i className="fas fa-check text-white mr-2 text-xs"></i> Ưu tiên xử lý sự cố trong vòng 24 giờ.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
