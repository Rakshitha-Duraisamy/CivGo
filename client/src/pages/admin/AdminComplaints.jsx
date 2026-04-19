import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Edit, Eye, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { StatusBadge, PriorityBadge } from '../../components/Badges';

export default function AdminComplaints() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/admin/complaints');
      setComplaints(data.complaints);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/complaints/${id}/status`, { status: newStatus });
      toast.success('Status updated');
      setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const trackingId = c.trackingId || c._id || '';
    const citizenName = c.user?.name || '';
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Complaint Management</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage all citizen complaints.</p>
        </div>
      </div>

      <div className="glass-card p-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search by ID, Title, or Citizen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
              <select
                className="input-field pl-10 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center] cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                  <div className="flex items-center gap-1">ID <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                  <div className="flex items-center gap-1">Details <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                  <div className="flex items-center gap-1">Category <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-mono text-slate-500">{(complaint.trackingId || complaint._id).slice(-6).toUpperCase()}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="font-medium text-slate-900 dark:text-white truncate max-w-xs">{complaint.title}</div>
                    <div className="text-xs text-slate-500">{complaint.user?.name || 'Citizen'} • {new Date(complaint.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{complaint.category}</td>
                  <td className="py-3 px-4"><PriorityBadge priority={complaint.priority} /></td>
                  <td className="py-3 px-4">
                    <select 
                      className="text-sm bg-transparent border-0 outline-none cursor-pointer focus:ring-0 p-0 text-slate-700 dark:text-slate-300 font-medium"
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredComplaints.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No complaints found.
            </div>
          )}
        </div>
        
        {/* Pagination Dummy */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredComplaints.length}</span> of <span className="font-medium">{filteredComplaints.length}</span> results
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary py-1 px-3 text-sm disabled:opacity-50" disabled>Previous</button>
            <button className="btn-secondary py-1 px-3 text-sm disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
