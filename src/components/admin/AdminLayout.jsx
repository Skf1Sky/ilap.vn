import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen font-sans">
      {/* CỘT TRÁI: SIDEBAR */}
      <Sidebar />

      {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Admin Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
           <h3 className="text-lg font-bold text-gray-700">Trang Quản Trị</h3>
           <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Xin chào, <strong>Admin</strong></span>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                 <i className="fas fa-user"></i>
              </div>
           </div>
        </header>

        {/* Nơi nội dung các trang con hiện ra */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
           <Outlet /> 
        </main>
      </div>
    </div>
  );
};

// 👇 QUAN TRỌNG NHẤT LÀ DÒNG NÀY
export default AdminLayout;