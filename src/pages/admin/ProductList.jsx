import React, { useState, useMemo } from 'react';

const ProductList = ({ products, onAdd, onUpdate, onDelete }) => {
  // 1. STATE
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State Bộ lọc
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    id: '', name: '', price: '', category: 'laptop', discount: '', video: '', inStock: true,
    img1: null, img2: null, img3: null, img4: null, // Sửa thành null để chứa File thay vì String
    cpu: '', ram: '', disk: '', vga: '', spec4: '', spec6: ''
  });

  // 2. LOGIC LỌC
  const brands = useMemo(() => {
    if (activeTab !== 'laptop') return [];
    const laptopNames = products.filter(p => p.category === 'laptop').map(p => p.name.split(' ')[0]);
    return [...new Set(laptopNames)];
  }, [products, activeTab]);

  const filteredProducts = products.filter(product => {
    const matchCategory = activeTab === 'all' ? true : product.category === activeTab;
    const matchBrand = selectedBrand === 'all' ? true : product.name.toLowerCase().startsWith(selectedBrand.toLowerCase());
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchBrand && matchSearch;
  });

  // 3. CÁC HÀM XỬ LÝ
  const handleToggleStatus = (id) => {
    const product = products.find(p => p._id === id || p.id === id);
    if (product) onUpdate({ ...product, inStock: !product.inStock });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) onDelete(id);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({
      id: '', name: '', price: '', category: 'laptop', discount: '', video: '', inStock: true,
      img1: null, img2: null, img3: null, img4: null,
      cpu: '', ram: '', disk: '', vga: '', spec4: '', spec6: ''
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    const specs = product.specs || [];
    const imgs = product.images || [product.image];

    setFormData({
      ...product,
      // Load link ảnh cũ từ DB vào form
      img1: imgs[0] || null,
      img2: imgs[1] || null,
      img3: imgs[2] || null,
      img4: imgs[3] || null,
      discount: product.discount || '',
      inStock: product.inStock !== undefined ? product.inStock : true,
      cpu: specs[0] || '', ram: specs[1] || '', disk: specs[2] || '',
      spec4: specs[3] || '', vga: specs[4] || '', spec6: specs[5] || ''
    });
    setShowModal(true);
  };

  // Xử lý khi user chọn file ảnh
  const handleFileChange = (num, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [`img${num}`]: file }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const compiledSpecs = [
      formData.cpu, formData.ram, formData.disk,
      formData.spec4, formData.vga, formData.spec6
    ];

    // Phân loại: Đâu là ảnh cũ giữ lại, đâu là file mới cần up lên MinIO
    const oldImages = [];
    const newFiles = [];

    [formData.img1, formData.img2, formData.img3, formData.img4].forEach(item => {
      if (typeof item === 'string' && item !== '') oldImages.push(item);
      if (item instanceof File) newFiles.push(item);
    });

    const productToSave = {
      ...formData,
      oldImages, // Mảng link ảnh cũ (MongoDB)
      newFiles,  // Mảng file vật lý (Chuẩn bị gửi lên MinIO)
      price: Number(formData.price),
      specs: compiledSpecs,
      id: isEditing ? (formData._id || formData.id) : Date.now(),
      inStock: formData.inStock === 'true' || formData.inStock === true
    };

    // Dọn dẹp object trước khi ném cho parent
    ['cpu', 'ram', 'disk', 'spec4', 'vga', 'spec6', 'img1', 'img2', 'img3', 'img4'].forEach(key => delete productToSave[key]);

    isEditing ? onUpdate(productToSave) : onAdd(productToSave);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Hàm render preview ảnh cực mượt
  const renderPreview = (imgData) => {
    if (!imgData) return null;
    if (typeof imgData === 'string') return imgData; // Link từ MongoDB
    return URL.createObjectURL(imgData); // File vừa chọn từ máy tính
  };

  // 4. GIAO DIỆN
  return (
    <div className="animate-fade-in-up pb-10">
      {/* Header & Button */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quản Lý Sản Phẩm</h2>
          <p className="text-gray-500 text-sm">Tổng cộng: <strong>{filteredProducts.length}</strong> sản phẩm</p>
        </div>
        <button onClick={handleAddNew} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition flex items-center">
          <i className="fas fa-plus mr-2"></i> Thêm Mới
        </button>
      </div>

      {/* Bộ Lọc */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {[{ id: 'all', label: 'Tất cả', icon: 'fa-list' }, { id: 'laptop', label: 'Laptop', icon: 'fa-laptop' }, { id: 'pc', label: 'PC - Máy bàn', icon: 'fa-desktop' }].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedBrand('all'); }} className={`px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-800 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <i className={`fas ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
          <div className="ml-auto relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" placeholder="Tìm tên sản phẩm..." className="pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-blue-500 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        {activeTab === 'laptop' && (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-xs font-bold text-gray-500 uppercase mr-2">Hãng:</span>
            <button onClick={() => setSelectedBrand('all')} className={`px-3 py-1 rounded border text-xs font-bold transition ${selectedBrand === 'all' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>Tất cả</button>
            {brands.map((brand, index) => (
              <button key={index} onClick={() => setSelectedBrand(brand)} className={`px-3 py-1 rounded border text-xs font-bold transition ${selectedBrand === brand ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>{brand}</button>
            ))}
          </div>
        )}
      </div>

      {/* Bảng Danh Sách */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="p-4 border-b w-16">Ảnh</th>
              <th className="p-4 border-b">Tên & Giá</th>
              <th className="p-4 border-b">Khuyến mãi</th>
              <th className="p-4 border-b text-center">Trạng thái</th>
              <th className="p-4 border-b text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredProducts.length > 0 ? filteredProducts.map((p) => {
              // Lấy ảnh đầu tiên để hiển thị (từ DB)
              const displayImg = (p.images && p.images[0]) ? p.images[0] : p.image;
              
              return (
              <tr key={p._id || p.id} className={`hover:bg-gray-50 transition border-b last:border-0 group ${!p.inStock ? 'bg-gray-50 opacity-75' : ''}`}>
                <td className="p-4"><div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-white p-1"><img src={displayImg} alt="" className="w-full h-full object-contain" onError={(e) => e.target.src = 'https://placehold.co/100x100?text=No+Image'} /></div></td>
                <td className="p-4">
                  <div className="font-bold text-gray-800">{p.name}</div>
                  <div className="text-red-600 font-bold font-mono mt-1">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
                </td>
                <td className="p-4">{p.discount ? (<span className="bg-red-100 text-red-600 px-2 py-1 rounded border border-red-200 text-xs font-bold inline-flex items-center"><i className="fas fa-tags mr-1"></i> {p.discount}</span>) : (<span className="text-gray-400 text-xs italic opacity-50">-- Không --</span>)}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleToggleStatus(p._id || p.id)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition shadow-sm flex items-center justify-center mx-auto w-28 gap-2 ${p.inStock ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300'}`}>
                    <i className={`fas ${p.inStock ? 'fa-check-circle' : 'fa-times-circle'}`}></i>{p.inStock ? 'Còn Hàng' : 'Hết Hàng'}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(p)} className="w-8 h-8 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"><i className="fas fa-pen"></i></button>
                    <button onClick={() => handleDelete(p._id || p.id)} className="w-8 h-8 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            )}) : (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">Không tìm thấy sản phẩm nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (FORM NHẬP LIỆU) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden animate-fade-in-up">
            <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">{isEditing ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
              <button onClick={() => setShowModal(false)} className="hover:text-red-400 transition"><i className="fas fa-times text-xl"></i></button>
            </div>

            <form onSubmit={handleSave} className="p-6 max-h-[85vh] overflow-y-auto">
              {/* Thông báo chuẩn bị cho MinIO */}
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3 text-sm">
                 <i className="fas fa-info-circle mt-0.5"></i>
                 <div>
                    <strong>Hệ thống lưu trữ mới:</strong> Ảnh upload tại đây sẽ được đẩy lên server <b>MinIO</b>, dữ liệu text lưu tại <b>database.ntcomp.site</b>.
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* CỘT TRÁI: THÔNG TIN CHUNG */}
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="font-bold text-blue-600 uppercase text-xs border-b pb-2 mb-3">1. Thông tin chung</h4>
                  <div><label className="text-xs font-bold text-gray-500 block mb-1">Tên sản phẩm</label><input required name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-gray-500 block mb-1">Giá bán (VNĐ)</label><input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none" /></div>
                    <div><label className="text-xs font-bold text-gray-500 block mb-1">Tình trạng</label><select name="inStock" value={formData.inStock} onChange={handleChange} className="w-full border p-2 rounded bg-white focus:ring-2 ring-blue-500"><option value={true}>Còn hàng</option><option value={false}>Hết hàng</option></select></div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">Loại sản phẩm</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded bg-yellow-50 font-bold text-gray-800 focus:ring-2 ring-yellow-400">
                      <option value="laptop">Laptop</option>
                      <option value="pc">PC - Máy tính bàn</option>
                    </select>
                  </div>
                  <div className="bg-red-50 p-3 rounded border border-red-100"><label className="text-xs font-bold text-red-500 block mb-1"><i className="fas fa-gift mr-1"></i> Khuyến mãi</label><input name="discount" value={formData.discount} onChange={handleChange} className="w-full border border-red-200 p-2 rounded text-red-600 font-bold placeholder-red-200 outline-none" placeholder="VD: Giảm 500k..." /></div>
                </div>

                {/* CỘT PHẢI: MEDIA (UPLOAD FILE CHO MINIO) */}
                <div className="lg:col-span-5 space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-blue-600 uppercase text-xs border-b border-gray-200 pb-2 mb-3">2. Ảnh Sản Phẩm (Upload MinIO)</h4>

                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="relative group">
                        <label className="block border-2 border-dashed border-gray-300 rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition overflow-hidden bg-white">
                           {formData[`img${num}`] ? (
                             <img src={renderPreview(formData[`img${num}`])} className="w-full h-full object-cover" alt="" />
                           ) : (
                             <div className="text-center p-2 text-gray-400 group-hover:text-blue-500">
                               <i className="fas fa-cloud-upload-alt text-xl mb-1"></i>
                               <p className="text-[10px] font-bold">Tải ảnh {num} lên</p>
                             </div>
                           )}
                           {/* Input File ẩn */}
                           <input 
                             type="file" 
                             accept="image/*" 
                             className="hidden" 
                             onChange={(e) => handleFileChange(num, e)} 
                           />
                        </label>
                        {/* Nút xóa ảnh */}
                        {formData[`img${num}`] && (
                           <button type="button" onClick={() => setFormData(prev => ({...prev, [`img${num}`]: null}))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md hover:bg-red-600">
                             <i className="fas fa-times"></i>
                           </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4"><label className="text-xs font-bold text-gray-500 block mb-1">Link Video (Youtube)</label><input name="video" value={formData.video} onChange={handleChange} className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-500 outline-none" placeholder="https://youtube.com/..." /></div>
                </div>
              </div>

              {/* PHẦN DƯỚI: CẤU HÌNH CHI TIẾT */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-blue-600 uppercase text-xs border-b pb-2 mb-4">3. Cấu hình chi tiết ({formData.category === 'laptop' ? 'LAPTOP' : 'PC'})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-microchip mr-1"></i> Vi xử lý (CPU)</label><input required name="cpu" value={formData.cpu} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" placeholder="Core i5..." /></div>
                  <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-memory mr-1"></i> RAM</label><input required name="ram" value={formData.ram} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" placeholder="8GB..." /></div>
                  <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-hdd mr-1"></i> Ổ cứng</label><input required name="disk" value={formData.disk} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" placeholder="256GB SSD..." /></div>

                  <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className={`fas ${formData.category === 'laptop' ? 'fa-desktop' : 'fa-chess-board'} mr-1`}></i> {formData.category === 'laptop' ? 'Màn hình' : 'Mainboard'}</label><input required name="spec4" value={formData.spec4} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" /></div>
                  <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-gamepad mr-1"></i> Card đồ họa (VGA)</label><input required name="vga" value={formData.vga} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" /></div>
                  <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className={`fas ${formData.category === 'laptop' ? 'fa-weight-hanging' : 'fa-plug'} mr-1`}></i> {formData.category === 'laptop' ? 'Trọng lượng' : 'Nguồn & Vỏ Case'}</label><input required name="spec6" value={formData.spec6} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" /></div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white pb-2 z-10">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 bg-gray-100 rounded font-bold text-gray-600 hover:bg-gray-200 transition">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 rounded font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition">{isEditing ? 'Lưu Thay Đổi' : 'Tạo Mới & Tải Ảnh Lên'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;