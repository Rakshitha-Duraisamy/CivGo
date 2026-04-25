/* eslint-disable */
import { useState, useEffect } from 'react';
import { 
  FileText, Clock, CheckCircle, AlertTriangle, 
  TrendingUp, Users, MoreHorizontal, AlertCircle,
  Download, FileSpreadsheet, Settings, UserPlus,
  BarChart2, MapPin, Search, Star, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import api from '../../services/api';

// Simple Badge Components
const StatusBadge = ({ status }) => {
  const colors = {
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200'
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-medium border rounded-full ${colors[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const colors = {
    'Low': 'bg-slate-100 text-slate-700 border-slate-200',
    'Medium': 'bg-blue-100 text-blue-700 border-blue-200',
    'High': 'bg-orange-100 text-orange-700 border-orange-200',
    'Critical': 'bg-red-100 text-red-700 border-red-200'
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-medium border rounded-full ${colors[priority] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {priority}
    </span>
  );
};

export default function AdminDashboard() {
  const [data, setData] = useState({
    stats: { total: 0, pending: 0, inProgress: 0, resolved: 0, highPriority: 0 },
    recentComplaints: [],
    departments: [],
    categories: [],
    resolutionTime: { avg: '0', fastest: '0', slowest: '0' },
    highPriorityAlerts: [],
    feedback: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, complaintsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/complaints')
        ]);
        
        const complaints = complaintsRes.data.complaints || [];
        
        // 1. Dashboard Summary Derived Stats
        const inProgress = complaints.filter(c => c.status === 'In Progress').length;
        
        // 3. Department Performance (Group by category)
        const deptMap = {};
        complaints.forEach(c => {
          const dept = c.category || 'Other';
          if (!deptMap[dept]) deptMap[dept] = { name: dept, assigned: 0, resolved: 0, pending: 0 };
          deptMap[dept].assigned += 1;
          if (c.status === 'Resolved') deptMap[dept].resolved += 1;
          else deptMap[dept].pending += 1;
        });
        const departments = Object.values(deptMap);

        // 4. Complaint Category Summary (Just counts from deptMap)
        const categories = departments.map(d => ({ name: d.name, count: d.assigned })).sort((a,b) => b.count - a.count);

        // 5. Resolution Time Module
        const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' && c.createdAt && c.updatedAt);
        let avg = '0 Days', fastest = '0 Days', slowest = '0 Days';
        if (resolvedComplaints.length > 0) {
          const times = resolvedComplaints.map(c => {
            const start = new Date(c.createdAt).getTime();
            const end = new Date(c.updatedAt).getTime();
            return (end - start) / (1000 * 3600 * 24); // in days
          });
          const avgDays = times.reduce((a,b)=>a+b, 0) / times.length;
          const minDays = Math.min(...times);
          const maxDays = Math.max(...times);
          avg = `${avgDays.toFixed(1)} Days`;
          fastest = `${minDays.toFixed(1)} Days`;
          slowest = `${maxDays.toFixed(1)} Days`;
        }

        // 6. Priority Alerts Module
        const highPriorityAlerts = complaints.filter(c => ['High', 'Critical'].includes(c.priority) && c.status !== 'Resolved');

        // 7. User Feedback Module
        const feedbackList = complaints.filter(c => c.rating).map(c => ({
          title: c.title,
          rating: c.rating,
          feedback: c.feedback || 'No comments',
          date: c.updatedAt
        })).sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        // 9. Notifications Module (Derived system events)
        const recentEvents = complaints.slice(0, 5).map(c => ({
          id: c._id,
          message: c.status === 'Resolved' ? `Complaint resolved: ${c.title}` 
                 : c.priority === 'High' ? `High priority complaint raised: ${c.title}`
                 : `New complaint submitted: ${c.title}`,
          date: c.createdAt
        }));

        setData({
          stats: { ...dashboardRes.data.stats, inProgress },
          recentComplaints: complaints.slice(0, 5),
          departments,
          categories,
          resolutionTime: { avg, fastest, slowest },
          highPriorityAlerts,
          feedback: feedbackList,
          notifications: recentEvents
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        toast.error('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // 8. Export Reports Module logic
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text('CivGo Admin Report', 14, 15);
      
      const tableColumn = ["Title", "Category", "Priority", "Status"];
      const tableRows = [];

      data.recentComplaints.forEach(c => {
        tableRows.push([c.title, c.category, c.priority, c.status]);
      });

      autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
      doc.save(`civconnect-report-${new Date().getTime()}.pdf`);
      toast.success('PDF exported successfully');
    } catch (err) {
      toast.error('Failed to export PDF');
    }
  };

  const exportToExcel = () => {
    try {
      const worksheetData = data.recentComplaints.map(c => ({
        Title: c.title,
        Category: c.category,
        Status: c.status,
        Priority: c.priority,
        Date: new Date(c.createdAt).toLocaleDateString()
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      XLSX.writeFile(workbook, `civconnect-report-${new Date().getTime()}.xlsx`);
      toast.success('Excel exported successfully');
    } catch (err) {
      toast.error('Failed to export Excel');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  // Common Card Wrapper
  const Card = ({ title, children, action }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/80">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
        {action && action}
      </div>
      <div className="p-6 flex-1">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of civic services and system metrics.</p>
        </div>
      </div>

      {/* 1. Dashboard Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { title: "Total", value: data.stats.total, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { title: "Pending", value: data.stats.pending, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { title: "In Progress", value: data.stats.inProgress, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
          { title: "Resolved", value: data.stats.resolved, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { title: "High Priority", value: data.stats.highPriority, color: "text-red-600 bg-red-50 border-red-100" },
        ].map((stat, i) => (
          <div key={i} className={`rounded-xl p-5 border ${stat.color} flex flex-col items-center justify-center text-center shadow-sm`}>
            <p className="text-sm font-medium opacity-80 mb-1">{stat.title}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 10. Quick Actions Module & 8. Export Reports Module */}
      <div className="flex flex-wrap gap-3 py-4 border-y border-slate-200 dark:border-slate-700">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
          <Search className="w-4 h-4" /> View Complaints
        </button>
        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-600">
          <FileText className="w-4 h-4" /> Add Category
        </button>
        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-600">
          <Users className="w-4 h-4" /> Manage Users
        </button>
        
        <div className="flex-1"></div>
        
        <button onClick={exportToPDF} className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors border border-rose-200">
          <Download className="w-4 h-4" /> Export PDF
        </button>
        <button onClick={exportToExcel} className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors border border-emerald-200">
          <FileSpreadsheet className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3. Department Performance Module */}
          <Card title="Department Performance">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 font-medium">Department Name</th>
                    <th className="pb-3 font-medium text-center">Assigned</th>
                    <th className="pb-3 font-medium text-center text-emerald-600">Resolved</th>
                    <th className="pb-3 font-medium text-center text-amber-600">Pending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {data.departments.map((dept, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{dept.name}</td>
                      <td className="py-3 text-center">{dept.assigned}</td>
                      <td className="py-3 text-center text-emerald-600">{dept.resolved}</td>
                      <td className="py-3 text-center text-amber-600">{dept.pending}</td>
                    </tr>
                  ))}
                  {data.departments.length === 0 && (
                    <tr><td colSpan="4" className="py-4 text-center text-slate-500">No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 2. Recent Complaints Module */}
          <Card 
            title="Recent Complaints" 
            action={<button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {data.recentComplaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{c.title}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{c.category}</td>
                      <td className="py-3"><StatusBadge status={c.status} /></td>
                      <td className="py-3 text-right text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {data.recentComplaints.length === 0 && (
                    <tr><td colSpan="4" className="py-4 text-center text-slate-500">No recent complaints</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 6. Priority Alerts Module */}
          <Card title="High Priority Alerts">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 font-medium">Complaint Title</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {data.highPriorityAlerts.slice(0, 5).map((c) => (
                    <tr key={c._id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10">
                      <td className="py-3 font-medium text-red-600 dark:text-red-400 truncate max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          {c.title}
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{c.category}</td>
                      <td className="py-3 text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="py-3"><StatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                  {data.highPriorityAlerts.length === 0 && (
                    <tr><td colSpan="4" className="py-4 text-center text-slate-500">No active high priority alerts</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          
          {/* 5. Resolution Time Module */}
          <Card title="Resolution Time">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Average Time</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.resolutionTime.avg}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400">Fastest Resolution</span>
                <span className="text-sm font-semibold text-emerald-600">{data.resolutionTime.fastest}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400">Slowest Resolution</span>
                <span className="text-sm font-semibold text-rose-600">{data.resolutionTime.slowest}</span>
              </div>
            </div>
          </Card>

          {/* 4. Complaint Category Summary */}
          <Card title="Category Summary">
            <div className="space-y-3">
              {data.categories.map((cat, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    {cat.name}
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                    {cat.count}
                  </span>
                </div>
              ))}
              {data.categories.length === 0 && <p className="text-sm text-slate-500 text-center">No categories found</p>}
            </div>
          </Card>

          {/* 9. Notifications Module */}
          <Card title="Recent Notifications">
            <div className="space-y-4">
              {data.notifications.map((notif, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`mt-0.5 p-1.5 rounded-full ${notif.message.includes('High') ? 'bg-red-100 text-red-600' : notif.message.includes('resolved') ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    <BellIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">{notif.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(notif.date).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {data.notifications.length === 0 && <p className="text-sm text-slate-500 text-center">No recent notifications</p>}
            </div>
          </Card>

          {/* 7. User Feedback Module */}
          <Card title="Recent Feedback">
            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-700/50">
              {data.feedback.map((fb, i) => (
                <div key={i} className="pt-4 first:pt-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate pr-4">{fb.title}</p>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-100 dark:border-amber-800">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{fb.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{fb.feedback}"</p>
                </div>
              ))}
              {data.feedback.length === 0 && <p className="text-sm text-slate-500 text-center">No feedback available</p>}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

// Helper icon component since Bell isn't imported from lucide-react above
function BellIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
