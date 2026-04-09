import React, { useState, useEffect } from 'react';
import api from '../../api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { DollarSign, ShoppingBag, Box, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const [dataStats, setDataStats] = useState(null);

  useEffect(() => {
     const fetchStats = async () => {
         try {
             const res = await api.get('/api/stats');
             setDataStats(res.data);
         } catch(e) {
             console.error("Dashboard error:", e);
         }
     }
     fetchStats();
  }, []);

  if (!dataStats) return <div className="p-10 font-bold text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i>Đang đồng bộ dữ liệu...</div>;

  const { stats, recentOrders, chartData } = dataStats;

  const summary = [
    { label: 'Tổng Doanh Thu', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: 'Thực tế' },
    { label: 'Đơn Hàng Mới', value: stats.newOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100', trend: 'Chờ xử lý' },
    { label: 'Tồn Kho', value: stats.totalProducts, icon: Box, color: 'text-orange-600', bg: 'bg-orange-100', trend: 'Sản phẩm' },
    { label: 'Khách Hàng', value: stats.totalCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', trend: 'Hồ sơ' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hệ Thống iLap</h2>
          <p className="text-gray-500 mt-1">Sổ cái doanh thu và hoạt động kinh doanh trực tuyến trực tiếp từ CSDL.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95">
          <TrendingUp size={18} /> Xuất Báo Cáo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {summary.map((stat, index) => (
            <div key={index} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
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
               <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${stat.bg} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-gray-800 text-lg">Doanh Thu 7 Ngày Qua</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-6">Đơn Hàng Gần Đây</h3>
            <div className="space-y-4">
               {recentOrders && recentOrders.length > 0 ? recentOrders.map((order) => (
                 <div key={order._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                          {order.customerName ? order.customerName.charAt(0) : 'KH'}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-800">{order.customerName}</p>
                          <p className={`text-xs font-bold ${['pending'].includes(order.status) ? 'text-yellow-600' : 
                                                              ['cancelled'].includes(order.status) ? 'text-red-500' : 'text-emerald-600'}`}>
                             {order.status === 'pending' ? 'Chờ xác nhận' : 
                              order.status === 'shipping' ? 'Đang giao' : 
                              order.status === 'delivered' ? 'Đã giao' : 
                              order.status === 'cancelled' ? 'Đã huỷ' : 'Đã xác nhận'}
                          </p>
                       </div>
                    </div>
                    <span className="text-sm font-bold text-indigo-700">
                        {order.totalPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice) : 'Chưa rõ'}
                    </span>
                 </div>
               )) : (
                 <p className="text-sm text-gray-500">Chưa có đơn hàng nào</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;