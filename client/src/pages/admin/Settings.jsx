import { useState } from 'react';
import { User, Palette, Save, Bell, Shield, Map, HelpCircle, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile Settings', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security & Roles', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ];
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account and system preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div key={activeTab} className="glass-card p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Personal Information</h2>
                <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold uppercase">
                    {user?.name?.substring(0, 2) || 'AD'}
                  </div>
                  <div>
                    <button className="btn-secondary py-1.5 px-3 text-sm mb-2">Change Avatar</button>
                    <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                    <input type="text" className="input-field" defaultValue={user?.name || ''} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input type="email" className="input-field" defaultValue={user?.email || ''} />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Email Notifications</h2>
                <div className="space-y-4">
                  {[
                    { title: 'New Complaint Alerts', desc: 'Get notified when a new complaint is assigned to your department.' },
                    { title: 'SLA Warnings', desc: 'Alerts when a complaint is nearing its resolution deadline.' },
                    { title: 'Weekly Reports', desc: 'Receive weekly summary reports of department performance.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                    <input type="password" className="input-field" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                      <input type="password" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                      <input type="password" className="input-field" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Theme Preferences</h2>
                <p className="text-sm text-slate-500 mb-6">Select your preferred interface theme. (You can also use the toggle in the navbar).</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-primary-500 rounded-xl p-4 cursor-pointer relative">
                    <div className="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full border-2 border-white"></div>
                    <div className="h-20 bg-slate-100 rounded-lg mb-2"></div>
                    <p className="text-center text-sm font-medium">Light Theme</p>
                  </div>
                  <div className="border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 bg-slate-900 rounded-xl p-4 cursor-pointer">
                    <div className="h-20 bg-slate-800 rounded-lg mb-2 border border-slate-700"></div>
                    <p className="text-center text-sm font-medium text-white">Dark Theme</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
