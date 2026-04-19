import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <AdminSidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Navbar />
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
