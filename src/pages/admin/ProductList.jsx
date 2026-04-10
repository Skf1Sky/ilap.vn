import React, { useState, useMemo, useEffect } from 'react';

const ProductList = ({ products, onAdd, onUpdate, onDelete, onImportStock, fetchInventoryLogs }) => {
  // 1. STATE
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTab, setModalTab] = useState('info'); // 'info' or 'inventory'

  const [importAmount, setImportAmount] = useState('');
  const [importNote, setImportNote] = useState('');

  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // State Bộ lọc
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    id: '', name: '', price: '', category: 'laptop', brand: '', quantity: 0, 
    discount: '', video: '', inStock: true,
    condition: '', originalPrice: '', rating: 5,
    img1: null, img2: null, img3: null, img4: null,
    cpu: '', ram: '', disk: '', vga: '', spec4: '', spec6: ''
  });

  // 2. LOGIC LỌC
  const brands = useMemo(() => {
    if (activeTab === 'all') return [];
    if (activeTab === 'laptop') return ['Dell', 'Asus', 'Lenovo', 'MSI', 'Acer'];
    if (activeTab === 'linhkien') return ['Mainboard', 'Chip', 'RAM', 'VGA'];
    
    const categoryProducts = products.filter(p => p.category === activeTab);
    const existingBrands = categoryProducts.map(p => p.brand || (p.name && p.name.split(' ')[0]));
    return [...new Set(existingBrands.filter(b => b))];
  }, [products, activeTab]);

  const filteredProducts = products.filter(product => {
    const matchCategory = activeTab === 'all' ? true : product.category === activeTab;
    const matchBrand = selectedBrand === 'all' ? true : (product.brand === selectedBrand || (product.name && product.name.toLowerCase().startsWith(selectedBrand.toLowerCase())));
    const matchSearch = product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchBrand && matchSearch;
  });

  // 3. CÁC HÀM XỬ LÝ
  const handleToggleStatus = async (id) => {
    const product = products.find(p => p._id === id || p.id === id);
    if (product) {
        // Essential: Strip ID fields from payload body
        const updateData = { ...product, inStock: !product.inStock };
        delete updateData._id;
        delete updateData.id;
        await onUpdate(id, updateData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) onDelete(id);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setModalTab('info');
    setFormData({
      id: '', name: '', price: '', category: 'laptop', brand: '', quantity: 0,
      discount: '', video: '', inStock: true,
      condition: '', originalPrice: '', rating: 5,
      img1: null, img2: null, img3: null, img4: null,
      cpu: '', ram: '', disk: '', vga: '', spec4: '', spec6: ''
    });
    setShowModal(true);
  };

  const handleEdit = async (product) => {
    setIsEditing(true);
    setModalTab('info');
    const specs = product.specs || [];
    const imgs = product.images || [product.image];

    setFormData({
      ...product,
      brand: product.brand || '',
      quantity: product.quantity || 0,
      img1: imgs[0] || null,
      img2: imgs[1] || null,
      img3: imgs[2] || null,
      img4: imgs[3] || null,
      discount: product.discount || '',
      condition: product.condition || '',
      originalPrice: product.originalPrice || '',
      rating: product.rating || 5,
      inStock: product.inStock !== undefined ? product.inStock : true,
      cpu: (specs[0] && typeof specs[0] === 'object') ? specs[0].value : (specs[0] || ''), 
      ram: (specs[1] && typeof specs[1] === 'object') ? specs[1].value : (specs[1] || ''), 
      disk: (specs[2] && typeof specs[2] === 'object') ? specs[2].value : (specs[2] || ''),
      spec4: (specs[3] && typeof specs[3] === 'object') ? specs[3].value : (specs[3] || ''), 
      vga: (specs[4] && typeof specs[4] === 'object') ? specs[4].value : (specs[4] || ''), 
      spec6: (specs[5] && typeof specs[5] === 'object') ? specs[5].value : (specs[5] || '')
    });
    setShowModal(true);

    // Tải sẵn lịch sử kho khi mở Edit
    setLoadingHistory(true);
    const logs = await fetchInventoryLogs(product._id || product.id);
    setHistoryLogs(logs);
    setLoadingHistory(false);
  };

  const handleFileChange = (num, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [`img${num}`]: file }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    let labels = [];
    if (formData.category === 'laptop') {
      labels = ['Vi xử lý (CPU)', 'RAM', 'Ổ cứng', 'Màn hình', 'Card đồ họa (VGA)', 'Dung lượng PIN'];
    } else if (formData.category === 'pc') {
      labels = ['Vi xử lý (CPU)', 'RAM', 'Ổ cứng', 'Mainboard', 'Card đồ họa (VGA)', 'Nguồn & Vỏ Case'];
    } else {
      labels = ['Mainboard', 'Vi xử lý (CPU)', 'RAM', 'Card đồ họa (VGA)', 'Nguồn & Vỏ Case', 'Tản nhiệt/Khác'];
    }

    const compiledSpecs = [
      { name: labels[0], value: formData.cpu },
      { name: labels[1], value: formData.ram },
      { name: labels[2], value: formData.disk },
      { name: labels[3], value: formData.spec4 },
      { name: labels[4], value: formData.vga },
      { name: labels[5], value: formData.spec6 }
    ];

    const oldImages = [];
    const newFiles = [];

    [formData.img1, formData.img2, formData.img3, formData.img4].forEach(item => {
      if (typeof item === 'string' && item !== '') oldImages.push(item);
      if (item instanceof File) newFiles.push(item);
    });

    const body = {
      ...formData,
      oldImages,
      newFiles,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      quantity: Number(formData.quantity),
      specs: compiledSpecs,
      inStock: formData.inStock === 'true' || formData.inStock === true
    };

    // CLEANUP: Essential for MongoDB Update
    const productId = formData._id || formData.id;
    ['cpu', 'ram', 'disk', 'spec4', 'vga', 'spec6', 'img1', 'img2', 'img3', 'img4', '_id', 'id'].forEach(key => delete body[key]);

    const result = isEditing ? await onUpdate(productId, body) : await onAdd(body);
    
    if (result && result.success) {
        setShowModal(false);
    } else {
        alert('Lỗi khi lưu dữ liệu: ' + (result?.error || 'Không xác định'));
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSaveImport = async (e) => {
      e.preventDefault();
      const productId = formData._id || formData.id;
      const res = await onImportStock(productId, importAmount, importNote);
      if(res.success) {
          setImportAmount('');
          setImportNote('');
          // Refresh data
          setFormData(prev => ({...prev, quantity: res.product.quantity}));
          const logs = await fetchInventoryLogs(productId);
          setHistoryLogs(logs);
          alert('Nhập kho thành công!');
      } else {
          alert('Lỗi nhập kho');
      }
  };

  const renderPreview = (imgData) => {
    if (!imgData) return null;
    if (typeof imgData === 'string') return imgData; 
    return URL.createObjectURL(imgData); 
  };

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
          {[
            { id: 'all', label: 'Tất cả', icon: 'fa-list' }, 
            { id: 'laptop', label: 'Laptop', icon: 'fa-laptop' }, 
            { id: 'pc', label: 'PC - Máy bàn', icon: 'fa-desktop' },
            { id: 'linhkien', label: 'Linh kiện', icon: 'fa-microchip' }
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedBrand('all'); }} className={`px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-800 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <i className={`fas ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
          <div className="ml-auto relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" placeholder="Tìm tên sản phẩm..." className="pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-blue-500 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        
        {activeTab !== 'all' && (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-xs font-bold text-gray-500 uppercase mr-2">Hãng / Loại:</span>
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
              <th className="p-4 border-b">Tồn Kho</th>
              <th className="p-4 border-b text-center">Trạng thái</th>
              <th className="p-4 border-b text-center">Xử lý</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredProducts.length > 0 ? filteredProducts.map((p) => {
              const displayImg = (p.images && p.images[0]) ? p.images[0] : p.image;
              
              return (
              <tr key={p._id || p.id} className={`hover:bg-gray-50 transition border-b last:border-0 group ${!p.inStock ? 'bg-gray-50 opacity-75' : ''}`}>
                <td className="p-4"><div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-white p-1"><img src={displayImg} alt="" className="w-full h-full object-contain" onError={(e) => e.target.src = 'https://placehold.co/100x100?text=No+Image'} /></div></td>
                <td className="p-4">
                  <div className="font-bold text-gray-800 line-clamp-1">{p.name}</div>
                  <div className="text-red-600 font-bold font-mono mt-1">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
                </td>
                <td className="p-4">
                    <div className={`font-bold ${p.quantity > 0 ? 'text-blue-600' : 'text-red-500'}`}>Còn: {p.quantity || 0}</div>
                    <div className="text-gray-500 text-xs text-nowrap">Đã bán: <span className="font-bold text-gray-700">{p.sold || 0}</span></div>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleToggleStatus(p._id || p.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-black inline-block border transition-all active:scale-95 ${p.inStock ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}
                   >
                    {p.inStock ? 'SẴN SÀNG' : 'HẾT HÀNG'}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(p)} className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center border border-blue-100 shadow-sm"><i className="fas fa-pen text-xs"></i></button>
                    <button onClick={() => handleDelete(p._id || p.id)} className="w-9 h-9 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center border border-red-100 shadow-sm"><i className="fas fa-trash text-xs"></i></button>
                  </div>
                </td>
              </tr>
            )}) : (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">Không tìm thấy sản phẩm nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (Tích hợp CHỈNH SỬA + KHO) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            
            {/* Header + Tabs */}
            <div className="bg-slate-900 text-white shrink-0">
               <div className="px-6 py-4 flex justify-between items-center border-b border-white/10">
                  <h3 className="font-black text-xl tracking-tight">
                    {isEditing ? (
                        <>CHỈNH SỬA: <span className="text-primary font-light italic ml-1">{formData.name}</span></>
                    ) : 'THÊM SẢN PHẨM MỚI'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-red-500 transition border border-white/20 flex items-center justify-center"><i className="fas fa-times text-sm"></i></button>
               </div>

               {isEditing && (
                 <div className="px-6 flex gap-8">
                    <button 
                        onClick={() => setModalTab('info')}
                        className={`py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${modalTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        Thông tin chi tiết
                    </button>
                    <button 
                        onClick={() => setModalTab('inventory')}
                        className={`py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${modalTab === 'inventory' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        Quản lý kho & Lịch sử
                    </button>
                 </div>
               )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
               {modalTab === 'info' ? (
                 <form onSubmit={handleSave}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* CỘT TRÁI: THÔNG TIN CHUNG */}
                        <div className="lg:col-span-12 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-black text-primary uppercase text-[10px] tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> 1. THÔNG TIN CƠ BẢN</h4>
                                    <div><label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5 ml-1">Tên sản phẩm</label><input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-bold text-gray-800 shadow-sm" /></div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5 ml-1">Loại danh mục</label>
                                            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-bold text-gray-800 shadow-sm">
                                                <option value="laptop">Laptop</option>
                                                <option value="pc">PC - Máy tính bàn</option>
                                                <option value="linhkien">Linh kiện rời</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5 ml-1">Hãng sản xuất</label>
                                            <select name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-bold text-gray-800 shadow-sm">
                                                <option value="">-- Chọn hãng --</option>
                                                {formData.category === 'laptop' ? ['Dell', 'Asus', 'Lenovo', 'MSI', 'Acer', 'HP', 'Apple'].map(b => <option key={b} value={b}>{b}</option>) :
                                                ['Mainboard', 'Chip', 'RAM', 'VGA', 'Nguồn & Case', 'SSD/HDD', 'Khác'].map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div><label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5 ml-1">Giá bán</label><input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-bold text-red-600 shadow-sm" /></div>
                                        <div><label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5 ml-1">Giá gốc</label><input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-bold text-gray-400 shadow-sm" /></div>
                                        <div><label className="text-[11px] font-black text-primary uppercase tracking-wider block mb-1.5 ml-1">Tồn kho</label><input required type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-blue-50/50 border-2 border-blue-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-black text-primary shadow-sm" /></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-black text-primary uppercase text-[10px] tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> 2. TRẠNG THÁI & ƯU ĐÃI</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5 ml-1">Tình trạng</label><input name="condition" value={formData.condition} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-bold shadow-sm" placeholder="Mới 99%..." /></div>
                                        <div><label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5 ml-1">Kho hàng</label><select name="inStock" value={formData.inStock} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-bold shadow-sm"><option value={true}>Sẵn hàng</option><option value={false}>Hết hàng</option></select></div>
                                    </div>
                                    <div><label className="text-[11px] font-black text-red-500 uppercase tracking-wider block mb-1.5 ml-1">Quà tặng / Khuyến mãi</label><input name="discount" value={formData.discount} onChange={handleChange} className="w-full bg-red-50/30 border-2 border-red-100 p-3 rounded-xl focus:border-red-500 outline-none transition-all font-bold text-red-600 shadow-sm" /></div>
                                    <div><label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5 ml-1">Đánh giá (1-5 sao)</label><input type="number" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-black text-yellow-600 shadow-sm" /></div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div>
                                    <h4 className="font-black text-primary uppercase text-[10px] tracking-widest flex items-center gap-2 mb-4"><div className="w-2 h-2 rounded-full bg-primary"></div> 3. HÌNH ẢNH & MEDIA</h4>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[1, 2, 3, 4].map((num) => (
                                        <div key={num} className="relative group aspect-square">
                                            <label className="block border-2 border-dashed border-gray-200 rounded-2xl h-full flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all overflow-hidden bg-white shadow-sm">
                                                {formData[`img${num}`] ? (
                                                    <img src={renderPreview(formData[`img${num}`])} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                                                ) : (
                                                    <div className="text-center p-2 text-gray-300 group-hover:text-primary">
                                                        <i className="fas fa-camera text-xl"></i>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(num, e)} />
                                            </label>
                                            {formData[`img${num}`] && (
                                                <button type="button" onClick={() => setFormData(prev => ({...prev, [`img${num}`]: null}))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-lg hover:scale-110 transition-transform">
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            )}
                                        </div>
                                        ))}
                                    </div>
                                    <div className="mt-4"><label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5 ml-1">Link Video Review</label><input name="video" value={formData.video} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-medium text-blue-600 underline shadow-sm" placeholder="https://youtube.com/..." /></div>
                                </div>

                                <div>
                                    <h4 className="font-black text-primary uppercase text-[10px] tracking-widest flex items-center gap-2 mb-4"><div className="w-2 h-2 rounded-full bg-primary"></div> 4. CẤU HÌNH KỸ THUẬT</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{formData.category === 'linhkien' ? 'Mainboard' : 'CPU'}</label>
                                            <input required name="cpu" value={formData.cpu} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-2.5 rounded-xl focus:border-primary outline-none text-sm font-bold shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{formData.category === 'linhkien' ? 'CPU' : 'RAM'}</label>
                                            <input required name="ram" value={formData.ram} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-2.5 rounded-xl focus:border-primary outline-none text-sm font-bold shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{formData.category === 'linhkien' ? 'RAM' : 'Ổ cứng'}</label>
                                            <input required name="disk" value={formData.disk} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-2.5 rounded-xl focus:border-primary outline-none text-sm font-bold shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{formData.category === 'laptop' ? 'Màn hình' : formData.category === 'pc' ? 'Mainboard' : 'VGA'}</label>
                                            <input required name="spec4" value={formData.spec4} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-2.5 rounded-xl focus:border-primary outline-none text-sm font-bold shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{formData.category === 'linhkien' ? 'Nguồn & Case' : 'VGA (Card đồ họa)'}</label>
                                            <input required name="vga" value={formData.vga} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-2.5 rounded-xl focus:border-primary outline-none text-sm font-bold shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{formData.category === 'laptop' ? 'Pin / PIN' : 'Tản nhiệt / Case'}</label>
                                            <input required name="spec6" value={formData.spec6} onChange={handleChange} className="w-full bg-white border-2 border-gray-100 p-2.5 rounded-xl focus:border-primary outline-none text-sm font-bold shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-3 sticky bottom-0 bg-gray-50/80 backdrop-blur-md pt-4 pb-2 z-10">
                        <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-400 hover:bg-gray-100 transition-all uppercase text-xs tracking-widest">Hủy bỏ</button>
                        <button type="submit" className="px-10 py-3 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all uppercase text-xs tracking-widest active:scale-95">Lưu thay đổi</button>
                    </div>
                 </form>
               ) : (
                 <div className="space-y-8 animate-fade-in">
                    {/* KHU VỰC NHẬP KHO */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h4 className="font-black text-teal-600 uppercase text-xs tracking-widest flex items-center gap-3 mb-6">
                            <i className="fas fa-box-open text-xl"></i> NHẬP THÊM HÀNG VÀO KHO
                        </h4>
                        <form onSubmit={handleSaveImport} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Số lượng (+)</label>
                                <input type="number" required min="1" value={importAmount} onChange={e => setImportAmount(e.target.value)} className="w-full bg-teal-50/30 border-2 border-teal-100 rounded-2xl p-4 focus:border-teal-500 outline-none font-black text-teal-700 text-lg shadow-inner" placeholder="0" />
                            </div>
                            <div className="md:col-span-6">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ghi chú nhập hàng</label>
                                <input type="text" value={importNote} onChange={e => setImportNote(e.target.value)} className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 focus:border-teal-500 outline-none font-bold shadow-sm" placeholder="VD: Nhập lô hàng Dell Latitude mới..." />
                            </div>
                            <div className="md:col-span-3">
                                <button type="submit" className="w-full bg-teal-600 text-white font-black py-4 rounded-2xl hover:bg-teal-700 transition shadow-xl shadow-teal-500/30 active:scale-95 uppercase text-xs tracking-widest">Xác nhận nhập</button>
                            </div>
                        </form>
                    </div>

                    {/* LỊCH SỬ KHO */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                            <h4 className="font-black uppercase text-xs tracking-widest flex items-center gap-3">
                                <i className="fas fa-history text-lg"></i> LỊCH SỬ LƯU CHUYỂN KHO
                            </h4>
                            <div className="flex gap-4">
                               <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-black">HIỆN TẠI: {formData.quantity}</div>
                            </div>
                        </div>
                        
                        <div className="max-h-[400px] overflow-y-auto">
                            {loadingHistory ? (
                                <div className="p-10 text-center animate-pulse text-gray-400 font-bold italic">Đang tải lịch sử...</div>
                            ) : (
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead className="bg-gray-50 border-b sticky top-0 shadow-sm z-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <tr>
                                            <th className="p-5">Thời gian</th>
                                            <th className="p-5 text-center">Hành động</th>
                                            <th className="p-5 text-center">Số lượng</th>
                                            <th className="p-5">Ghi chú</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 bg-white">
                                        {historyLogs.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center p-10 text-gray-300 italic font-medium">Chưa có bản ghi hoạt động nào</td></tr>
                                        ) : historyLogs.map(log => (
                                            <tr key={log._id} className="hover:bg-gray-50 transition border-l-4 border-transparent hover:border-indigo-500">
                                                <td className="p-5 text-xs text-gray-500 font-medium">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                                                <td className="p-5 text-center">
                                                    {log.action === 'import' ? <span className="bg-teal-100 text-teal-700 font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-tighter shadow-sm">NHẬP KHO</span> :
                                                    log.action === 'export' ? <span className="bg-orange-100 text-orange-600 font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-tighter shadow-sm">XUẤT BÁN</span> :
                                                    <span className="bg-purple-100 text-purple-700 font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-tighter shadow-sm">HOÀN TRẢ</span>}
                                                </td>
                                                <td className="p-5 text-center font-black font-mono text-base">
                                                    {log.action === 'import' || log.action === 'restock_cancel' ? <span className="text-teal-600">+{log.amount}</span> : <span className="text-orange-500">-{log.amount}</span>}
                                                </td>
                                                <td className="p-5 text-xs text-gray-600 font-medium italic">{log.note || '---'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;