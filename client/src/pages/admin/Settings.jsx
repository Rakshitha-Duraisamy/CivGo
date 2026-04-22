import { useState } from 'react';
import { User, Bell, Palette, Shield, Settings2, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  
  // Dummy states for the UI
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  
  const [categories, setCategories] = useState(['Roads', 'Electricity', 'Water', 'Sanitation']);
  const [newCat, setNewCat] = useState('');
  
  const [priorities, setPriorities] = useState(['Low', 'Medium', 'High', 'Critical']);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast.success('Password changed successfully');
  };

  const addCategory = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      setCategories([...categories, newCat.trim()]);
      setNewCat('');
      toast.success('Category added');
    }
  };

  const removeCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
    toast.success('Category removed');
  };

  const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/80">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and platform preferences.</p>
      </div>

      <div className="space-y-6">
        {/* 1. Profile Section */}
        <SectionCard title="Profile & Security" icon={User}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Info */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-100 dark:border-slate-700 pb-2">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Name</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" defaultValue={user?.name || 'Administrator'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input type="email" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" defaultValue={user?.email || 'admin@civgo.com'} />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                Save Profile
              </button>
            </form>

            {/* Change Password */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-100 dark:border-slate-700 pb-2">Change Password</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button type="submit" className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-200 dark:border-slate-600">
                Update Password
              </button>
            </form>
          </div>
        </SectionCard>

        {/* 2. Preferences Section */}
        <SectionCard title="Preferences" icon={Settings2}>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Dark Mode</p>
                <p className="text-xs text-slate-500 mt-0.5">Toggle platform theme appearance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Email Notifications</p>
                <p className="text-xs text-slate-500 mt-0.5">Receive alerts for high priority tasks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </SectionCard>

        {/* 3. Complaint Settings Section */}
        <SectionCard title="Complaint Settings" icon={Shield}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Manage Categories */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Manage Categories</h3>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="New category name" 
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500" 
                />
                <button onClick={addCategory} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {categories.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg group">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{cat}</span>
                    <button onClick={() => removeCategory(cat)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Manage Priorities */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Active Priority Labels</h3>
              <div className="flex flex-wrap gap-2">
                {priorities.map((p, i) => {
                  const colors = {
                    'Low': 'bg-slate-100 text-slate-700 border-slate-200',
                    'Medium': 'bg-blue-100 text-blue-700 border-blue-200',
                    'High': 'bg-orange-100 text-orange-700 border-orange-200',
                    'Critical': 'bg-red-100 text-red-700 border-red-200'
                  };
                  return (
                    <span key={i} className={`px-3 py-1.5 text-xs font-medium border rounded-full ${colors[p]}`}>
                      {p}
                    </span>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-4">Priority labels are currently hardcoded for system stability. Contact super-admin to modify.</p>
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}
