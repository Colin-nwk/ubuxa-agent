
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { 
  Download, 
  Calendar, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Target,
  Users,
  Box,
  ArrowUpRight
} from 'lucide-react';

const barData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 38 },
  { name: 'Apr', value: 65 },
  { name: 'May', value: 48 },
  { name: 'Jun', value: 59 },
];

const trendData = [
  { name: 'Week 1', revenue: 1200000 },
  { name: 'Week 2', revenue: 1800000 },
  { name: 'Week 3', revenue: 1600000 },
  { name: 'Week 4', revenue: 2400000 },
  { name: 'Week 5', revenue: 2100000 },
  { name: 'Week 6', revenue: 3200000 },
];

const COLORS = ['#0077C2', '#00A3E0', '#0f172a', '#0077C2', '#00A3E0', '#0f172a'];

const Reports: React.FC = () => {
  return (
    <div className="space-y-10 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Intelligence</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Audit sales performance and hub efficiency trends</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold flex items-center space-x-3 text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar size={20} />
            <span>Select Period</span>
          </button>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
            <Download size={20} />
            <span>Export Audit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Performance Trend */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Revenue Stream</h3>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">LTM Growth Protocol</p>
             </div>
             <div className="bg-blue-50 text-ubuxa-blue px-4 py-1.5 rounded-xl text-xs font-black uppercase flex items-center">
                <TrendingUp size={14} className="mr-2" />
                +24% Growth
             </div>
          </div>
          <div className="h-80 flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0077C2" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0077C2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 700 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0077C2" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Distribution */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Density</h3>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Regional Unit Distribution</p>
             </div>
             <Box size={24} className="text-slate-300" />
          </div>
          <div className="h-80 flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }} />
                  <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <ReportMetric 
          title="Conversion Efficiency" 
          value="75.5%" 
          subtitle="Identity to transaction ratio" 
          icon={<Target size={24} />} 
          color="bg-ubuxa-blue" 
         />
         <ReportMetric 
          title="Unit LTV" 
          value="₦420,000" 
          subtitle="Average lifetime unit value" 
          icon={<ArrowUpRight size={24} />} 
          color="bg-slate-900" 
         />
         <ReportMetric 
          title="Network Tier" 
          value="#3 / 15" 
          subtitle="Regional agent hierarchy" 
          icon={<Users size={24} />} 
          color="bg-ubuxa-blue" 
         />
      </div>
    </div>
  );
};

const ReportMetric: React.FC<{ title: string, value: string, subtitle: string, icon: React.ReactNode, color: string }> = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-ubuxa-blue transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
    <div className="flex items-center space-x-6">
      <div className={`w-16 h-16 ${color} rounded-[1.5rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 italic tracking-tight mt-1">{value}</h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
      </div>
    </div>
    <div className="hidden sm:block">
       <button className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center group-hover:bg-ubuxa-blue group-hover:text-white transition-all">
          <ChevronRight size={24} />
       </button>
    </div>
  </div>
);

export default Reports;
