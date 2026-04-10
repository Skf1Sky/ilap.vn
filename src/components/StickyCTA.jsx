import React from 'react';

const StickyCTA = () => {
  // Thay thế số điện thoại thực tế tại đây
  const phoneNumber = "0900000000"; 
  const zaloNumber = "0900000000";

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-2 grid grid-cols-2 gap-2 z-[9999] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {/* Nút Gọi Điện */}
      <a 
        href={`tel:${phoneNumber}`}
        className="flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-200 active:scale-95 transition-transform"
      >
        <i className="fas fa-phone-alt animate-bounce"></i>
        <span>GỌI ĐIỆN</span>
      </a>

      {/* Nút Nhắn Zalo */}
      <a 
        href={`https://zalo.me/${zaloNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#0068ff] text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 active:scale-95 transition-transform"
      >
        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <i className="fas fa-comment text-[#0068ff] text-[10px]"></i>
        </div>
        <span>NHẮN ZALO</span>
      </a>
    </div>
  );
};

export default StickyCTA;
