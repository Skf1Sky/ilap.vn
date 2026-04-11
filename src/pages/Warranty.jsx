import React, { useState } from 'react';
import api from '../api';

const Warranty = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!phone.trim()) return;

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const res = await api.get(`/api/customers/check-warranty/${phone}`);
            if (res.data.success) {
                setResults(res.data.data);
                if (res.data.data.length === 0) {
                    setError('Không tìm thấy thông tin bảo hành cho số điện thoại này.');
                }
            } else {
                setError('Có lỗi xảy ra khi tra cứu.');
            }
        } catch (err) {
            setError('Không thể kết nối đến máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    const calculateStatus = (purchaseDate, policy) => {
        const pDate = new Date(purchaseDate);
        const months = parseInt(policy) || 12; // Mặc định 12 tháng nếu không đọc được
        const expiryDate = new Date(pDate.setMonth(pDate.getMonth() + months));
        const today = new Date();
        
        const isExpired = today > expiryDate;
        return {
            expiryDate: expiryDate.toLocaleDateString('vi-VN'),
            isExpired,
            daysLeft: Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        TRA CỨU <span className="text-primary">BẢO HÀNH</span>
                    </h1>
                    <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                        Nhập số điện thoại mua hàng để kiểm tra thời hạn bảo hành và lịch sử thiết bị của bạn tại ILap.vn
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 mb-12 flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <i className="fas fa-phone-alt absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input 
                            type="text" 
                            placeholder="Nhập số điện thoại của bạn..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-0 text-lg font-medium"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <i className="fas fa-circle-notch fa-spin"></i>
                        ) : (
                            <i className="fas fa-search"></i>
                        )}
                        <span>KIỂM TRA NGAY</span>
                    </button>
                </div>

                {/* Error / Empty State */}
                {error && (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-red-600 font-medium mb-8">
                        <i className="fas fa-exclamation-circle text-2xl mb-2 block"></i>
                        {error}
                    </div>
                )}

                {/* Results Section */}
                {results && results.length > 0 && (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-center gap-3 mb-2 px-2">
                            <i className="fas fa-history text-primary"></i>
                            <h2 className="text-xl font-bold text-gray-800">Thông tin khách hàng: {results[0].name}</h2>
                        </div>
                        {results.map((item, idx) => {
                            const status = calculateStatus(item.purchaseDate, item.warrantyPolicy);
                            return (
                                <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-primary uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Sản phẩm</span>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{item.productName}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <i className="far fa-calendar-alt text-gray-400"></i>
                                                    Ngày mua: {new Date(item.purchaseDate).toLocaleDateString('vi-VN')}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <i className="fas fa-shield-alt text-gray-400"></i>
                                                    Gói: {item.warrantyPolicy}
                                                </span>
                                            </div>
                                            {item.note && (
                                                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic border-l-4 border-gray-200">
                                                    Ghi chú: {item.note}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="w-full md:w-auto text-center md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                                            <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${status.isExpired ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {status.isExpired ? 'Hết hạn bảo hành' : 'Đang trong bảo hành'}
                                            </div>
                                            <div className="text-3xl font-black text-gray-900 mb-1">
                                                {status.expiryDate}
                                            </div>
                                            <div className="text-xs text-gray-400 font-bold uppercase">Ngày hết hạn</div>
                                            {!status.isExpired && (
                                                <div className="mt-3 inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                                                    Còn {status.daysLeft} ngày
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Banner / Extra Info */}
                {!results && !loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 text-primary text-xl">
                                <i className="fas fa-bolt"></i>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Tra cứu nhanh</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">Thông tin bảo hành được cập nhật ngay sau khi bạn mua hàng.</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 text-purple-600 text-xl">
                                <i className="fas fa-history"></i>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Lịch sử máy</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">Xem lại tất cả thiết bị bạn đã từng mua tại hệ thống của chúng tôi.</p>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 text-orange-500 text-xl">
                                <i className="fas fa-headset"></i>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Hỗ trợ 24/7</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">Gặp vấn đề? Liên hệ ngay Hotline 0909.909.619 để được xử lý.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Warranty;
