import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../../data';

const ProductList = () => {
  // 1. STATE DỮ LIỆU
  const [products, setProducts] = useState(PRODUCTS.map(p => ({ ...p, inStock: true, ...p }))); 
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // 2. STATE BỘ LỌC
  const [activeTab, setActiveTab] = useState('all'); 
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 3. STATE FORM
  // Lưu ý: Tôi dùng tên biến chung (spec4, spec5...) để linh hoạt cho cả PC và Laptop
  const [formData, setFormData] = useState({
    id: '', name: '', price: '', image: '', category: 'laptop',
    discount: '', video: '', inStock: true,
    cpu: '', ram: '', disk: '', vga: '', 
    spec4: '', // Laptop: Màn hình | PC: Mainboard
    spec6: ''  // Laptop: Trọng lượng | PC: Nguồn & Case
  });

  // --- LOGIC LỌC ---
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

  // --- CÁC HÀM XỬ LÝ ---

  const handleToggleStatus = (id) => {
    const updatedProducts = products.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p);
    setProducts(updatedProducts);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddNew = () => {
    setIsEditing(false);
    // Reset form
    setFormData({ 
        id: '', name: '', price: '', image: '', category: 'laptop', discount: '', video: '', inStock: true,
        cpu: '', ram: '', disk: '', vga: '', spec4: '', spec6: '' 
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    const specs = product.specs || [];
    setFormData({
      ...product,
      discount: product.discount || '',
      inStock: product.inStock !== undefined ? product.inStock : true,
      // Load dữ liệu cũ lên
      cpu: specs[0] || '',
      ram: specs[1] || '',
      disk: specs[2] || '',
      spec4: specs[3] || '', // Màn hình hoặc Mainboard
      vga: specs[4] || '',
      spec6: specs[5] || ''  // Trọng lượng hoặc Nguồn
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Ghép dữ liệu thành mảng specs chuẩn
    const compiledSpecs = [
        formData.cpu, 
        formData.ram, 
        formData.disk, 
        formData.spec4, // Vị trí số 3
        formData.vga, 
        formData.spec6  // Vị trí số 5
    ];

    const productToSave = {
      ...formData,
      price: Number(formData.price),
      specs: compiledSpecs,
      id: isEditing ? formData.id : Date.now(),
      inStock: formData.inStock === 'true' || formData.inStock === true
    };
    
    // Xóa biến tạm
    delete productToSave.cpu; delete productToSave.ram; delete productToSave.disk; 
    delete productToSave.spec4; delete productToSave.vga; delete productToSave.spec6;

    if (isEditing) {
      setProducts(products.map(p => p.id === productToSave.id ? productToSave : p));
    } else {
      setProducts([productToSave, ...products]);
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
  };

  // --- GIAO DIỆN ---
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
            {[ { id: 'all', label: 'Tất cả', icon: 'fa-list' }, { id: 'laptop', label: 'Laptop', icon: 'fa-laptop' }, { id: 'pc', label: 'PC - Máy bàn', icon: 'fa-desktop' } ].map(tab => (
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
              <tr key={p.id} className={`hover:bg-gray-50 transition border-b last:border-0 group ${!p.inStock ? 'bg-gray-50 opacity-75' : ''}`}>
                <td className="p-4"><div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-white p-1"><img src={p.image} alt="" className="w-full h-full object-contain" /></div></td>
                <td className="p-4">
                    <div className="font-bold text-gray-800">{p.name}</div>
                    <div className="text-red-600 font-bold font-mono mt-1">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
                </td>
                <td className="p-4">{p.discount ? (<span className="bg-red-100 text-red-600 px-2 py-1 rounded border border-red-200 text-xs font-bold inline-flex items-center"><i className="fas fa-tags mr-1"></i> {p.discount}</span>) : (<span className="text-gray-400 text-xs italic opacity-50">-- Không --</span>)}</td>
                <td className="p-4 text-center">
                    <button onClick={() => handleToggleStatus(p.id)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition shadow-sm flex items-center justify-center mx-auto w-28 gap-2 ${p.inStock ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300'}`}>
                        <i className={`fas ${p.inStock ? 'fa-check-circle' : 'fa-times-circle'}`}></i>{p.inStock ? 'Còn Hàng' : 'Hết Hàng'}
                    </button>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(p)} className="w-8 h-8 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"><i className="fas fa-pen"></i></button>
                    <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            )) : (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">Không tìm thấy sản phẩm nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL THÔNG MINH --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up">
            <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">{isEditing ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
              <button onClick={() => setShowModal(false)} className="hover:text-red-400 transition"><i className="fas fa-times text-xl"></i></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cột Trái: Thông tin chung */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-blue-600 uppercase text-xs border-b pb-2 mb-3">1. Thông tin chung</h4>
                    <div><label className="text-xs font-bold text-gray-500 block mb-1">Tên sản phẩm</label><input required name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs font-bold text-gray-500 block mb-1">Giá bán</label><input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none" /></div>
                        <div><label className="text-xs font-bold text-gray-500 block mb-1">Tình trạng</label><select name="inStock" value={formData.inStock} onChange={handleChange} className="w-full border p-2 rounded bg-white"><option value={true}>Còn hàng</option><option value={false}>Hết hàng</option></select></div>
                    </div>
                    {/* 👇 CHỌN LOẠI SẢN PHẨM Ở ĐÂY 👇 */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">Loại sản phẩm (Chọn để đổi form)</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded bg-yellow-50 font-bold text-gray-800 focus:ring-2 ring-yellow-400">
                            <option value="laptop">Laptop</option>
                            <option value="pc">PC - Máy tính bàn</option>
                        </select>
                    </div>
                    <div className="bg-red-50 p-3 rounded border border-red-100"><label className="text-xs font-bold text-red-500 block mb-1"><i className="fas fa-gift mr-1"></i> Khuyến mãi</label><input name="discount" value={formData.discount} onChange={handleChange} className="w-full border border-red-200 p-2 rounded text-red-600 font-bold placeholder-red-200 outline-none" placeholder="VD: Giảm 500k..." /></div>
                  </div>

                  {/* Cột Phải: Media */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-blue-600 uppercase text-xs border-b pb-2 mb-3">2. Hình ảnh & Video</h4>
                    <div><label className="text-xs font-bold text-gray-500 block mb-1">Link Ảnh Chính</label><input required name="image" value={formData.image} onChange={handleChange} className="w-full border p-2 rounded" />{formData.image && <img src={formData.image} className="h-20 mt-2 rounded border p-1 object-contain bg-white mx-auto" alt="preview" />}</div>
                    <div><label className="text-xs font-bold text-gray-500 block mb-1">Link Video (Youtube Embed)</label><input name="video" value={formData.video} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://..." /></div>
                  </div>
              </div>

              {/* --- CẤU HÌNH CHI TIẾT (TỰ ĐỔI LABEL THEO CATEGORY) --- */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-blue-600 uppercase text-xs border-b pb-2 mb-4">3. Cấu hình chi tiết ({formData.category === 'laptop' ? 'LAPTOP' : 'PC'})</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {/* CPU, RAM, Disk giống nhau */}
                      <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-microchip mr-1"></i> Vi xử lý (CPU)</label><input required name="cpu" value={formData.cpu} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" placeholder="Core i5, Ryzen 5..." /></div>
                      <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-memory mr-1"></i> RAM</label><input required name="ram" value={formData.ram} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" placeholder="8GB, 16GB..." /></div>
                      <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-hdd mr-1"></i> Ổ cứng</label><input required name="disk" value={formData.disk} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" placeholder="256GB SSD..." /></div>

                      {/* 👇 Ô THAY ĐỔI THEO LOẠI 👇 */}
                      
                      {/* Ô số 4: Màn hình (Laptop) HOẶC Mainboard (PC) */}
                      <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">
                              <i className={`fas ${formData.category === 'laptop' ? 'fa-desktop' : 'fa-chess-board'} mr-1`}></i> 
                              {formData.category === 'laptop' ? 'Màn hình' : 'Mainboard'}
                          </label>
                          <input required name="spec4" value={formData.spec4} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" 
                                 placeholder={formData.category === 'laptop' ? "14 inch FHD..." : "B460M, Z490..."} />
                      </div>

                      {/* Ô số 5: VGA */}
                      <div><label className="text-xs font-bold text-gray-500 block mb-1"><i className="fas fa-gamepad mr-1"></i> Card đồ họa (VGA)</label><input required name="vga" value={formData.vga} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" placeholder="GTX 1650, RTX 3060..." /></div>

                      {/* Ô số 6: Trọng lượng (Laptop) HOẶC Nguồn (PC) */}
                      <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">
                              <i className={`fas ${formData.category === 'laptop' ? 'fa-weight-hanging' : 'fa-plug'} mr-1`}></i> 
                              {formData.category === 'laptop' ? 'Trọng lượng' : 'Nguồn & Vỏ Case'}
                          </label>
                          <input required name="spec6" value={formData.spec6} onChange={handleChange} className="w-full border p-2 rounded bg-gray-50 outline-none" 
                                 placeholder={formData.category === 'laptop' ? "1.2 kg..." : "Nguồn 500W, Case kính..."} />
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