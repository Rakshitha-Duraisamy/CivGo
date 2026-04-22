import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Reports() {
  const [startDate, setStartDate] = useState('2024-04-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('All');
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const fetchAndFilterData = async () => {
    try {
      const { data } = await api.get('/admin/complaints');
      const filtered = data.complaints.filter(c => {
        const cDate = new Date(c.createdAt);
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        eDate.setHours(23, 59, 59, 999);

        const inDateRange = cDate >= sDate && cDate <= eDate;
        const matchesCategory = category === 'All' || c.category === category;
        
        return inDateRange && matchesCategory;
      });
      return filtered;
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch data for export');
      return null;
    }
  };

  const exportToPDF = async () => {
    setLoadingPdf(true);
    const data = await fetchAndFilterData();
    if (data && data.length > 0) {
      const doc = new jsPDF();
      doc.text('CivicConnect Complaints Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Date Range: ${startDate} to ${endDate} | Category: ${category}`, 14, 22);

      const tableColumn = ["ID", "Title", "Citizen", "Category", "Status", "Priority", "Date"];
      const tableRows = [];

      data.forEach(c => {
        const rowData = [
          (c.trackingId || c._id).slice(-6).toUpperCase(),
          c.title,
          c.user?.name || 'Unknown',
          c.category,
          c.status,
          c.priority,
          new Date(c.createdAt).toLocaleDateString()
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 28,
      });

      doc.save(`civconnect-report-${new Date().getTime()}.pdf`);
      toast.success('PDF exported successfully');
    } else if (data && data.length === 0) {
      toast.error('No data found for the selected criteria');
    }
    setLoadingPdf(false);
  };

  const exportToExcel = async () => {
    setLoadingExcel(true);
    const data = await fetchAndFilterData();
    if (data && data.length > 0) {
      const worksheetData = data.map(c => ({
        ID: (c.trackingId || c._id).slice(-6).toUpperCase(),
        Title: c.title,
        Citizen: c.user?.name || 'Unknown',
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
    } else if (data && data.length === 0) {
      toast.error('No data found for the selected criteria');
    }
    setLoadingExcel(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Export system data and view summary metrics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Export Data</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date Range</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="date" 
                    className="input-field pl-10" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)} 
                  />
                </div>
                <span className="text-slate-500 flex items-center">to</span>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="date" 
                    className="input-field pl-10" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <select 
                className="input-field cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Roads">Roads</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={exportToPDF}
                disabled={loadingPdf}
                className="flex-1 btn-primary bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 flex justify-center items-center gap-2 py-2.5 disabled:opacity-70"
              >
                {loadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {loadingPdf ? 'Exporting...' : 'PDF Report'}
              </button>
              <button 
                onClick={exportToExcel}
                disabled={loadingExcel}
                className="flex-1 btn-primary bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex justify-center items-center gap-2 py-2.5 disabled:opacity-70"
              >
                {loadingExcel ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                {loadingExcel ? 'Exporting...' : 'Excel Export'}
              </button>
            </div>
          </div>
        </div>

        {/* Saved Reports / Templates */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Scheduled Reports</h2>
          <div className="space-y-3">
            {[
              { title: 'Weekly Department Summary', schedule: 'Every Monday at 8:00 AM' },
              { title: 'Monthly Resolution Metrics', schedule: '1st of every month' },
              { title: 'SLA Breach Alerts', schedule: 'Daily at 9:00 AM' }
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{report.title}</h3>
                  <p className="text-xs text-slate-500">{report.schedule}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
