import React, { useState, useMemo } from 'react';

// --- HÀM HỖ TRỢ (Đặt ngoài component) ---

// 1. Hàm biến Link Drive thành Link Ảnh trực tiếp
const convertDriveLink = (url) => {
  if (!url) return '';
  if (!url.includes('drive.google.com')) return url;
  const idMatch = url.match(/\/d\/(.+?)\//);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }
  return url;
};

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
    img1: '', img2: '', img3: '', img4: '',
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
    const product = products.find(p => p._id === id || p.id === id); // Tìm cả id và _id
    if (product) {
      onUpdate({ ...product, inStock: !product.inStock });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      onDelete(id);
    }
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({
      id: '', name: '', price: '', image: '', category: 'laptop', discount: '', video: '', inStock: true,
      cpu: '', ram: '', disk: '', vga: '', spec4: '', spec6: ''
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    const specs = product.specs || [];
    // Lấy mảng ảnh từ sản phẩm (nếu có)
    const imgs = product.images || [product.image];

    setFormData({
      ...product,
      // 👇 Đổ dữ liệu vào 4 ô
      img1: imgs[0] || '',
      img2: imgs[1] || '',
      img3: imgs[2] || '',
      img4: imgs[3] || '',

      discount: product.discount || '',
      inStock: product.inStock !== undefined ? product.inStock : true,
      cpu: specs[0] || '', ram: specs[1] || '', disk: specs[2] || '',
      spec4: specs[3] || '', vga: specs[4] || '', spec6: specs[5] || ''
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    // 👇 Xử lý cả 4 link Google Drive
    const processedImages = [
      convertDriveLink(formData.img1),
      convertDriveLink(formData.img2),
      convertDriveLink(formData.img3),
      convertDriveLink(formData.img4)
    ].filter(link => link !== ''); // Loại bỏ những ô trống

    const compiledSpecs = [
      formData.cpu, formData.ram, formData.disk,
      formData.spec4, formData.vga, formData.spec6
    ];

    const productToSave = {
      ...formData,
      images: processedImages, // 👉 Gửi mảng ảnh lên server
      // image: processedImages[0], // (Không cần gửi cái này nữa, server dùng images)
      price: Number(formData.price),
      specs: compiledSpecs,
      id: isEditing ? formData.id : Date.now(),
      inStock: formData.inStock === 'true' || formData.inStock === true
    };

    // Xóa biến thừa trước khi gửi cho gọn
    delete productToSave.cpu; delete productToSave.ram; delete productToSave.disk;
    delete productToSave.spec4; delete productToSave.vga; delete productToSave.spec6;
    delete productToSave.img1; delete productToSave.img2; delete productToSave.img3; delete productToSave.img4;

    if (isEditing) {
      onUpdate(productToSave);
    } else {
      onAdd(productToSave);
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
            {filteredProducts.length > 0 ? filteredProducts.map((p) => (
              <tr key={p._id || p.id} className={`hover:bg-gray-50 transition border-b last:border-0 group ${!p.inStock ? 'bg-gray-50 opacity-75' : ''}`}>
                <td className="p-4"><div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-white p-1"><img src={p.image} alt="" className="w-full h-full object-contain" /></div></td>
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
            )) : (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">Không tìm thấy sản phẩm nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (FORM NHẬP LIỆU) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up">
            <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">{isEditing ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
              <button onClick={() => setShowModal(false)} className="hover:text-red-400 transition"><i className="fas fa-times text-xl"></i></button>
            </div>

            <form onSubmit={handleSave} className="p-6 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* CỘT TRÁI: THÔNG TIN CHUNG */}
                <div className="space-y-4">
                  <h4 className="font-bold text-blue-600 uppercase text-xs border-b pb-2 mb-3">1. Thông tin chung</h4>
                  <div><label className="text-xs font-bold text-gray-500 block mb-1">Tên sản phẩm</label><input required name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-gray-500 block mb-1">Giá bán</label><input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none" /></div>
                    <div><label className="text-xs font-bold text-gray-500 block mb-1">Tình trạng</label><select name="inStock" value={formData.inStock} onChange={handleChange} className="w-full border p-2 rounded bg-white"><option value={true}>Còn hàng</option><option value={false}>Hết hàng</option></select></div>
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

                {/* CỘT PHẢI: MEDIA */}
                <div className="space-y-4">
                  <h4 className="font-bold text-blue-600 uppercase text-xs border-b pb-2 mb-3">2. Bộ Sưu Tập Ảnh (Tối đa 4)</h4>

                  {/* Lặp qua 4 ô nhập cho gọn code */}
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="relative">
                      <label className="text-xs font-bold text-gray-500 block mb-1">Ảnh {num} {num === 1 && '(Ảnh đại diện)'}</label>
                      <div className="flex gap-2">
                        <input
                          name={`img${num}`} // img1, img2...
                          value={formData[`img${num}`]}
                          onChange={handleChange}
                          className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500"
                          placeholder="Link Drive / Link ảnh..."
                          required={num === 1} // Chỉ bắt buộc ảnh 1
                        />
                        {/* Xem trước ảnh nhỏ bên cạnh */}
                        {formData[`img${num}`] && (
                          <img
                            src={convertDriveLink(formData[`img${num}`])}
                            className="w-10 h-10 object-cover rounded border bg-white"
                            alt=""
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  <div><label className="text-xs font-bold text-gray-500 block mb-1">Link Video (Youtube)</label><input name="video" value={formData.video} onChange={handleChange} className="w-full border p-2 rounded" /></div>
                </div>
              </div>

              {/* PHẦN DƯỚI: CẤU HÌNH CHI TIẾT */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-blue-600 uppercase text-xs border-b pb-2 mb-4">3. Cấu hình chi tiết ({formData.category === 'laptop' ? 'LAPTOP' : 'PC'})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-microchip mr-1"></i> Vi xử lý (CPU)</label><input required name="cpu" value={formData.cpu} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" placeholder="Core i5..." /></div>
                  <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-memory mr-1"></i> RAM</label><input required name="ram" value={formData.ram} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" placeholder="8GB..." /></div>
                  <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-hdd mr-1"></i> Ổ cứng</label><input required name="disk" value={formData.disk} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" placeholder="256GB SSD..." /></div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1"><i className={`fas ${formData.category === 'laptop' ? 'fa-desktop' : 'fa-chess-board'} mr-1`}></i> {formData.category === 'laptop' ? 'Màn hình' : 'Mainboard'}</label>
                    <input required name="spec4" value={formData.spec4} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" />
                  </div>

                  <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-gamepad mr-1"></i> Card đồ họa (VGA)</label><input required name="vga" value={formData.vga} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" /></div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1"><i className={`fas ${formData.category === 'laptop' ? 'fa-weight-hanging' : 'fa-plug'} mr-1`}></i> {formData.category === 'laptop' ? 'Trọng lượng' : 'Nguồn & Vỏ Case'}</label>
                    <input required name="spec6" value={formData.spec6} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 bg-gray-100 rounded font-bold text-gray-600 hover:bg-gray-200">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 rounded font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30">{isEditing ? 'Lưu Thay Đổi' : 'Tạo Mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;