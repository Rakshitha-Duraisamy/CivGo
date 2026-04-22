/* eslint-disable */
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PublicDashboard() {
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [data, setData] = useState([]);

  useEffect(() => {
    // For demo, we just simulate the public stats or fetch from an open endpoint
    setStats({ total: 150, resolved: 100, pending: 50 });
    setData([
      { name: 'Roads', count: 40 },
      { name: 'Water', count: 30 },
      { name: 'Electricity', count: 50 },
      { name: 'Sanitation', count: 30 }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-900 text-center">Public Transparency Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-slate-200">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.total}</div>
            <div className="text-slate-500 font-medium">Total Complaints</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-slate-200">
            <div className="text-4xl font-bold text-emerald-500 mb-2">{stats.resolved}</div>
            <div className="text-slate-500 font-medium">Resolved Issues</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-slate-200">
            <div className="text-4xl font-bold text-orange-500 mb-2">{stats.pending}</div>
            <div className="text-slate-500 font-medium">Pending Actions</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Complaints by Category</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

