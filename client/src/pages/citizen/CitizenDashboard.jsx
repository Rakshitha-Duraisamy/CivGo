import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StatCard from '../../components/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/Badges';

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/complaints/my');
        if (data.complaints) {
          setComplaints(data.complaints);
        } else if (Array.isArray(data)) {
          setComplaints(data);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const recentComplaints = complaints.slice(0, 5);
  
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Citizen Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's an overview of your reports.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/history" className="btn-secondary flex items-center gap-2">
            View History
          </Link>
          <Link to="/submit-complaint" className="btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" /> Raise Complaint
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Complaints" value={totalCount} icon={FileText} colorClass="text-blue-600 bg-blue-50 dark:bg-blue-900/20" />
        <StatCard title="Pending" value={pendingCount} icon={AlertCircle} colorClass="text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" />
        <StatCard title="In Progress" value={inProgressCount} icon={Clock} colorClass="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" />
        <StatCard title="Resolved" value={resolvedCount} icon={CheckCircle} colorClass="text-green-600 bg-green-50 dark:bg-green-900/20" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Complaints</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentComplaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No complaints found.
                  </td>
                </tr>
              ) : (
                recentComplaints.map((complaint) => (
                  <tr key={complaint._id || complaint.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {(complaint.trackingId || complaint._id || complaint.id).slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[200px] truncate">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {complaint.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(complaint.createdAt || complaint.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <Link to={`/complaint/${complaint._id || complaint.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
