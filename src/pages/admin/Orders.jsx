import React, { useState, useEffect } from 'react';
import api from '../../api';

const processItemsDesc = (items) => {
    if(!items || items.length === 0) return 'Không có SP';
    if(items.length === 1) return `${items[0].name} (x${items[0].quantity})`;
    return `${items[0].name} và ${items.length - 1} SP khác`;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = filter ? `/api/orders?status=${filter}` : '/api/orders';
      const res = await api.get(url);
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/api/orders/${id}`, { status: newStatus });
      fetchOrders(); 
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái!");
    }
  };

  const deleteOrder = async (id) => {
    if(!window.confirm("Bạn muốn xóa hẳn đơn hàng này?")) return;
    try {
      await api.delete(`/api/orders/${id}`);
      fetchOrders();
    } catch (err) {
      alert("Lỗi khi xóa!");
    }
  };

  const tabs = [
      { key: '', label: 'Tất cả' },
      { key: 'pending', label: 'Chờ xử lý' },
      { key: 'confirmed', label: 'Đã xác nhận' },
      { key: 'shipping', label: 'Đang giao' },
      { key: 'delivered', label: 'Đã giao' },
      { key: 'cancelled', label: 'Đã huỷ' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center shrink-0">
          <i className="fas fa-shopping-cart text-blue-500 mr-2"></i> Danh Sách Đơn Hàng Online
        </h2>
        <button onClick={fetchOrders} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium text-sm transition">
           <i className="fas fa-sync-alt mr-1"></i> Làm mới
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 pb-2 border-b border-gray-100">
        {tabs.map(tab => (
            <button 
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-2 px-4 rounded-t-lg font-bold text-sm whitespace-nowrap transition border-b-2 ${filter === tab.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
                {tab.label}
            </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 opacity-50"><i className="fas fa-spinner fa-spin text-2xl mb-2"></i><p>Đang tải dữ liệu...</p></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500">Không tìm thấy đơn hàng nào.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold uppercase">Đơn Hàng</th>
                <th className="p-4 font-semibold uppercase">Thông Tin KH</th>
                <th className="p-4 font-semibold uppercase">Tổng Tiền</th>
                <th className="p-4 font-semibold uppercase">Trạng Thái</th>
                <th className="p-4 font-semibold uppercase w-[80px]">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="text-xs text-gray-400 mb-1">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                    <div className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs inline-block max-w-[200px] truncate" title={order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}>
                        {processItemsDesc(order.items)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{order.customerName}</div>
                    <div className="text-blue-600 font-medium tracking-wider text-sm mt-0.5">{order.phone}</div>
                    <div className="text-gray-500 text-xs mt-1 w-48 truncate" title={order.address}>{order.address || 'Chưa cập nhật địa chỉ'}</div>
                  </td>
                  <td className="p-4">
                     <span className="font-bold text-red-600">
                         {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice || 0)}
                     </span>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                        <select 
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold border-0 cursor-pointer min-w-[140px] focus:ring-2 focus:ring-blue-100
                                ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 
                                  order.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                                  order.status === 'shipping' ? 'bg-orange-50 text-orange-700' :
                                  order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                                  'bg-red-50 text-red-600'}`}
                        >
                            <option value="pending">⏳ Chờ xử lý</option>
                            <option value="confirmed">👍 Đã xác nhận</option>
                            <option value="shipping">🚚 Đang giao</option>
                            <option value="delivered">✅ Đã giao</option>
                            <option value="cancelled">❌ Đã huỷ</option>
                        </select>
                    </div>
                  </td>
                  <td className="p-4">
                    <button 
                        onClick={() => deleteOrder(order._id)}
                        title="Xóa rác"
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                        <i className="fas fa-trash"></i>
                    </button>
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
