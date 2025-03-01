import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-blue-600">
            <span className="text-white text-xl font-semibold">Dashboard</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
            >
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
            >
              <span>Profile</span>
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
            >
              <span>Settings</span>
            </Link>
          </nav>

          {/* User info */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between h-16 bg-white shadow-sm px-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;