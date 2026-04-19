import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/50 dark:bg-primary-900/20 blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 dark:bg-indigo-900/20 blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shadow-sm transition-all"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 justify-center">
          <MapPin className="h-10 w-10 text-primary-600" />
          <span className="font-bold text-3xl tracking-tight text-slate-900 dark:text-white">
            CivGo
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="glass-card py-8 px-4 sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
