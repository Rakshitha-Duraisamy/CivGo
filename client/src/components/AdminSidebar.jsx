import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Building2, 
  Users, 
  BarChart3, 
  Bell, 
  Settings 
} from 'lucide-react';
import { cn } from '../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Complaints', href: '/admin/complaints', icon: FileText },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:w-64 flex flex-col",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex-1 h-0 overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive 
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800",
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon
                    className={cn(
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                      "flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
