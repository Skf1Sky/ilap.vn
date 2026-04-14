import React, { useState, useEffect } from 'react';
import api from '../../api';

const Customers = ({ products }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // States form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', purchaseDate: new Date().toISOString().slice(0, 10),
    productId: '', warrantyPolicy: '3 Tháng', note: ''
  });

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/api/customers');
      setCustomers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);
  
  const [matchCustomer, setMatchCustomer] = useState(null);

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, phone: val});
    
    // Tìm khách hàng cũ theo SĐT
    if (val.length >= 4) {
        const found = customers.find(c => c.phone === val);
        if (found) setMatchCustomer(found);
        else setMatchCustomer(null);
    } else {
        setMatchCustomer(null);
    }
  };

  const useExistingName = () => {
    if (matchCustomer) {
        setFormData({...formData, name: matchCustomer.name});
        setMatchCustomer(null);
    }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      // Tìm tên SP theo ID
      let productName = "";
      if (formData.productId) {
         const p = products.find(x => String(x.id) === String(formData.productId) || String(x._id) === String(formData.productId));
         if(p) productName = p.name;
      }

      await api.post('/api/customers', {
        ...formData, productName
      });
      setShowForm(false);
      fetchCustomers();
      // Reset
      setFormData({ name: '', phone: '', purchaseDate: new Date().toISOString().slice(0, 10), productId: '', warrantyPolicy: '3 Tháng', note: '' });
    } catch (error) {
      alert("Lỗi khi thêm Khách hàng!");
    }
  };

  const deleteCustomer = async (id) => {
    if(!window.confirm("Bạn muốn xóa hồ sơ khách hàng này?")) return;
    try {
      await api.delete(`/api/customers/${id}`);
      fetchCustomers();
    } catch (err) { alert("Lỗi khi xóa!"); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center shrink-0">
          <i className="fas fa-users text-purple-500 mr-2"></i> Hồ Sơ Bảo Hành & Khách Hàng
        </h2>
        <button 
            onClick={() => setShowForm(!showForm)} 
            className="px-4 py-2 bg-purple-600 text-white rounded shadow text-sm font-bold hover:bg-purple-700 transition">
           <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} mr-2`}></i> 
           {showForm ? 'Hủy' : 'Thêm Hồ Sơ Mới'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateCustomer} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 shadow-inner">
           <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Nhập Thông Tin Khách Mua Hàng</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                 <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Tên khách hàng</label>
                 <input required name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500" placeholder="VD: Anh Minh" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Số điện thoại</label>
                 <input required name="phone" value={formData.phone} onChange={handlePhoneChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 font-medium" placeholder="09xxxx" />
                 {matchCustomer && (
                     <div className="mt-2 text-xs bg-purple-50 text-purple-700 p-2 rounded-lg border border-purple-100 flex justify-between items-center animate-pulse">
                         <span><i className="fas fa-user-check mr-1"></i> Khách cũ: <b>{matchCustomer.name}</b></span>
                         <button type="button" onClick={useExistingName} className="bg-purple-600 text-white px-2 py-0.5 rounded font-bold hover:bg-purple-700 transition">Dùng tên này</button>
                     </div>
                 )}
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Ngày mua máy</label>
                 <input type="date" required name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" />
              </div>
              <div className="lg:col-span-2">
                 <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Chọn Sản Phẩm Đã Bán</label>
                 <select name="productId" value={formData.productId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5">
                    <option value="">-- Chọn Laptop/PC --</option>
                    {products.map(p => (
                        <option key={p._id || p.id} value={p._id || p.id}>{p.name} - {new Intl.NumberFormat('vi-VN').format(p.price)}đ</option>
                    ))}
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Gói Bảo Hành</label>
                 <select name="warrantyPolicy" value={formData.warrantyPolicy} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5">
                    <option value="1 Tháng">Bảo hành 1 Tháng</option>
                    <option value="3 Tháng">Bảo hành 3 Tháng</option>
                    <option value="6 Tháng">Bảo hành 6 Tháng</option>
                 </select>
              </div>
           </div>
           <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Ghi chú (Tùy chọn)</label>
              <textarea name="note" value={formData.note} onChange={handleChange} rows="2" className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="Ví dụ: Tặng kèm balo, lỗi sước viền nhỏ..."></textarea>
           </div>
           <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 shadow-md">
               <i className="fas fa-save mr-2"></i> Lưu Hồ Sơ
           </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10 opacity-50"><i className="fas fa-spinner fa-spin text-2xl mb-2"></i><p>Đang tải dữ liệu...</p></div>
      ) : customers.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500">Chưa có khách hàng nào.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold uppercase">Tên & SĐT</th>
                <th className="p-4 font-semibold uppercase">Sản Phẩm Đã Mua</th>
                <th className="p-4 font-semibold uppercase">Ngày Mua</th>
                <th className="p-4 font-semibold uppercase">Bảo Hành</th>
                <th className="p-4 font-semibold uppercase w-[80px]">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map(c => {
                  const pDate = new Date(c.purchaseDate);
                  return (
                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                            <div className="font-bold text-gray-900">{c.name}</div>
                            <div className="text-blue-600 font-medium tracking-wider text-sm mt-0.5"><a href={`tel:${c.phone}`}>{c.phone}</a></div>
                        </td>
                        <td className="p-4">
                            <span className="font-semibold text-gray-700 text-sm">{c.productName || "Sản phẩm xóa/ẩn"}</span>
                            {c.note && <div className="text-xs text-gray-400 italic mt-1">Ghi chú: {c.note}</div>}
                        </td>
                        <td className="p-4 text-sm text-gray-600 font-medium">
                            {pDate.toLocaleDateString('vi-VN')}
                        </td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded inline-block text-xs font-bold ${c.warrantyPolicy?.includes('3') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>
                                {c.warrantyPolicy}
                            </span>
                        </td>
                        <td className="p-4 text-center">
                            <button 
                                onClick={() => deleteCustomer(c._id)}
                                title="Xóa"
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                <i className="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
