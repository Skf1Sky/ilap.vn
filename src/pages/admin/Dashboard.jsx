import React from 'react';

const Dashboard = () => {
  // Dữ liệu giả lập thống kê
  const stats = [
    { label: 'Tổng Doanh Thu', value: '150.2M', icon: 'fa-dollar-sign', color: 'bg-green-500' },
    { label: 'Đơn Hàng Mới', value: '24', icon: 'fa-shopping-bag', color: 'bg-blue-500' },
    { label: 'Sản Phẩm', value: '120', icon: 'fa-box-open', color: 'bg-orange-500' },
    { label: 'Khách Hàng', value: '1,250', icon: 'fa-users', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng Quan</h2>

      {/* Grid thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex items-center">
               <div className={`w-12 h-12 rounded-full ${stat.color} text-white flex items-center justify-center text-xl mr-4 shadow-lg shadow-gray-200`}>
                  <i className={`fas ${stat.icon}`}></i>
               </div>
               <div>
                  <p className="text-gray-500 text-xs uppercase font-bold">{stat.label}</p>
                  <h4 className="text-2xl font-bold text-gray-800">{stat.value}</h4>
               </div>
            </div>
         ))}
      </div>

      {/* Khu vực biểu đồ hoặc bảng (Để trống chờ phát triển) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-64 flex items-center justify-center text-gray-400">
            Khu vực Biểu Đồ Doanh Thu (Sắp làm)
         </div>
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-64 flex items-center justify-center text-gray-400">
            Khu vực Đơn Hàng Gần Nhất (Sắp làm)
         </div>
      </div>
    </div>
  );
};

export default Dashboard;