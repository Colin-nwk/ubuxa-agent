
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Download, 
  Calendar, 
  ArrowRight,
  // Added ChevronRight icon import
  ChevronRight 
} from 'lucide-react';

const data = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 38 },
  { name: 'Apr', value: 65 },
  { name: 'May', value: 48 },
  { name: 'Jun', value: 59 },
];

const COLORS = ['#1e293b', '#d4af37', '#1e293b', '#d4af37', '#1e293b', '#d4af37'];

const Reports: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Insights & Reports</h2>
          <p className="text-slate-500 text-sm">Analyze your efficiency and sales trends</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-slate-200 px-4 py-3 rounded-2xl font-bold flex items-center space-x-2 text-slate-600 hover:bg-slate-50">
            <Calendar size={18} />
            <span>Select Period</span>
          </button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-lg">
            <Download size={18} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Sales Volume</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
           <ReportCard 
            title="Conversion Rate" 
            value="75.5%" 
            subtitle="Efficiency of leads turned into sales" 
            color="bg-blue-600" 
           />
           <ReportCard 
            title="Avg. Deal Size" 
            value="₦420,000" 
            subtitle="Average value per successful transaction" 
            color="bg-gold" 
           />
           <ReportCard 
            title="Agent Ranking" 
            value="#3 / 15" 
            subtitle="Your current standing in your region" 
            color="bg-slate-900" 
           />
        </div>
      </div>
    </div>
  );
};

const ReportCard: React.FC<{ title: string, value: string, subtitle: string, color: string }> = ({ title, value, subtitle, color }) => (
  <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-gold transition-all">
    <div className="flex items-center space-x-5">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        <ArrowRight size={24} />
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
    <div className="hidden sm:block">
       <button className="p-3 text-slate-300 group-hover:text-gold transition-colors">
          <ChevronRight size={24} />
       </button>
    </div>
  </div>
);

export default Reports;
