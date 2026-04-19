import { useState, useEffect } from 'react';
import { 
  FileText, Clock, CheckCircle, AlertTriangle, 
  TrendingUp, Users, MoreHorizontal 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import StatCard from '../../components/StatCard';
import api from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/Badges';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [data, setData] = useState({
    stats: { total: 0, pending: 0, resolved: 0, highPriority: 0 },
    categoryData: [],
    monthlyTrend: []
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, complaintsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/complaints')
        ]);
        setData({
          stats: dashboardRes.data.stats,
          categoryData: dashboardRes.data.categoryData,
          monthlyTrend: dashboardRes.data.monthlyTrend
        });
        setRecentComplaints(complaintsRes.data.complaints.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">System performance and complaint metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Complaints" value={data.stats.total} icon={FileText} trend={12} colorClass="bg-blue-500" />
        <StatCard title="Pending" value={data.stats.pending} icon={Clock} trend={-5} colorClass="bg-amber-500" />
        <StatCard title="Resolved" value={data.stats.resolved} icon={CheckCircle} trend={18} colorClass="bg-emerald-500" />
        <StatCard title="High Priority" value={data.stats.highPriority} icon={AlertTriangle} trend={2} colorClass="bg-red-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Chart: Monthly Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Submission vs Resolution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="received" name="Received" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart: Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Complaints by Category</h2>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden mt-8"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Complaints requiring action</h2>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Citizen</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Issue</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentComplaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-mono text-slate-500">{(complaint.trackingId || complaint._id).slice(-6).toUpperCase()}</td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-900 dark:text-white">{complaint.user?.name || 'Citizen'}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                    <div className="font-medium text-slate-900 dark:text-white">{complaint.title}</div>
                    <div className="text-xs text-slate-500">{complaint.category}</div>
                  </td>
                  <td className="py-4 px-6"><PriorityBadge priority={complaint.priority} /></td>
                  <td className="py-4 px-6"><StatusBadge status={complaint.status} /></td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-primary-600 transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
