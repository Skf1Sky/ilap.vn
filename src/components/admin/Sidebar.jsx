import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: 'fa-tachometer-alt' },
    { name: 'Sản phẩm', path: '/admin/products', icon: 'fa-box' },
    { name: 'Đơn hàng', path: '/admin/orders', icon: 'fa-shopping-cart' },
    { name: 'Khách hàng', path: '/admin/users', icon: 'fa-users' },
  ];

  return (
    <div className="w-64 bg-slate-800 min-h-screen text-white flex flex-col transition-all duration-300">
      {/* Logo Admin */}
      <div className="h-16 flex items-center justify-center border-b border-slate-700">
        <h2 className="text-2xl font-bold">ILAP<span className="text-blue-500">.ADMIN</span></h2>
      </div>

      {/* Menu List */}
      <div className="flex-1 py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-1">
              <NavLink 
                to={item.path}
                end={item.path === '/admin'} // Để tránh active nhầm trang con
                className={({ isActive }) => 
                  `flex items-center px-6 py-3 hover:bg-slate-700 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300'}`
                }
              >
                <i className={`fas ${item.icon} w-6`}></i>
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
        <button className="flex items-center text-slate-300 hover:text-white transition-colors w-full">
            <i className="fas fa-sign-out-alt w-6"></i> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;