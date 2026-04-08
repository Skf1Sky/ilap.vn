import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy đơn hàng
  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://database.ntcomp.site/api/orders');
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Đổi trạng thái xử lý
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      await axios.put(`https://database.ntcomp.site/api/orders/${id}`, { status: newStatus });
      fetchOrders(); // Load lại DS
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái!");
    }
  };

  // Xóa đơn rác
  const deleteOrder = async (id) => {
    if(!window.confirm("Bạn muốn xóa hẳn đơn hàng này?")) return;
    try {
      await axios.delete(`https://database.ntcomp.site/api/orders/${id}`);
      fetchOrders();
    } catch (err) {
      alert("Lỗi khi xóa!");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center shrink-0">
          <i className="fas fa-shopping-cart text-blue-500 mr-2"></i> Danh Sách Đơn Hàng Online
        </h2>
        <button onClick={fetchOrders} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium text-sm transition">
           <i className="fas fa-sync-alt mr-1"></i> Làm mới
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 opacity-50"><i className="fas fa-spinner fa-spin text-2xl mb-2"></i><p>Đang tải dữ liệu...</p></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500">Chưa có đơn hàng nào.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold uppercase">Ngày Đặt</th>
                <th className="p-4 font-semibold uppercase">Khách Hàng</th>
                <th className="p-4 font-semibold uppercase">Sản Phẩm</th>
                <th className="p-4 font-semibold uppercase">Trạng Thái</th>
                <th className="p-4 font-semibold uppercase w-[150px]">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{order.customerName}</div>
                    <div className="text-blue-600 font-medium tracking-wider text-sm mt-0.5">{order.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">{order.productName}</span>
                  </td>
                  <td className="p-4">
                    {order.status === 'pending' ? (
                        <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold shrink-0">Chưa xử lý</span>
                    ) : (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold shrink-0">Đã chốt sale</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => toggleStatus(order._id, order.status)}
                            title={order.status === 'pending' ? 'Đánh dấu Đã chốt' : 'Đánh dấu Chưa xử lý'}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${order.status === 'pending' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            <i className="fas fa-check"></i>
                        </button>
                        <button 
                            onClick={() => deleteOrder(order._id)}
                            title="Xóa rác"
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
