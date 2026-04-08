import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { DollarSign, ShoppingBag, Box, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  // Dữ liệu biểu đồ mượt mà
  const data = [
    { name: 'Thứ 2', revenue: 4000, orders: 240 },
    { name: 'Thứ 3', revenue: 3000, orders: 198 },
    { name: 'Thứ 4', revenue: 2000, orders: 980 },
    { name: 'Thứ 5', revenue: 2780, orders: 390 },
    { name: 'Thứ 6', revenue: 1890, orders: 480 },
    { name: 'Thứ 7', revenue: 2390, orders: 380 },
    { name: 'CN', revenue: 3490, orders: 430 },
  ];

  const stats = [
    { label: 'Tổng Doanh Thu', value: '150.2M', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '+12.5%' },
    { label: 'Đơn Hàng Mới', value: '24', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+3.2%' },
    { label: 'Sản Phẩm', value: '120', icon: Box, color: 'text-orange-600', bg: 'bg-orange-100', trend: 'Ổn định' },
    { label: 'Khách Hàng', value: '1,250', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+18%' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hệ Thống iLap</h2>
          <p className="text-gray-500 mt-1">Chào buổi sáng, đây là tình hình kinh doanh hôm nay.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95">
          <TrendingUp size={18} /> Xuất Báo Cáo
        </button>
      </div>

      {/* Grid thống kê với hiệu ứng Hover mượt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {stats.map((stat, index) => (
            <div key={index} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
               <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                    <h4 className="text-2xl font-bold text-gray-800 tracking-tight">{stat.value}</h4>
                    <span className="text-xs font-semibold text-emerald-500 flex items-center mt-2">
                       <ArrowUpRight size={14} className="mr-1" /> {stat.trend}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                     <stat.icon size={24} />
                  </div>
               </div>
               {/* Trang trí nền nhẹ nhàng */}
               <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${stat.bg} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            </div>
         ))}
      </div>

      {/* Khu vực Biểu đồ Real-time */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-gray-800 text-lg">Biểu Đồ Doanh Thu Tuần</h3>
               <select className="bg-gray-50 border-none text-sm text-gray-500 rounded-lg focus:ring-0 cursor-pointer">
                  <option>7 ngày qua</option>
                  <option>30 ngày qua</option>
               </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-6">Đơn Hàng Gần Đây</h3>
            <div className="space-y-4">
               {[1,2,3,4].map((i) => (
                 <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          KH
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-800">Khách hàng #{i}</p>
                          <p className="text-xs text-gray-500">2 phút trước</p>
                       </div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">+1.2M</span>
                 </div>
               ))}
               <button className="w-full py-2 text-sm text-indigo-600 font-semibold hover:underline mt-4">Xem tất cả đơn hàng</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;