
import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  ShoppingCart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <StatCard 
          title="Total Sales" 
          value="₦2.25M" 
          icon={<TrendingUp className="text-ubuxa-blue" size={20} />} 
          trend="+12.5%" 
          positive 
        />
        <StatCard 
          title="Active Customers" 
          value="156" 
          icon={<Users className="text-ubuxa-blue" size={20} />} 
          trend="+4.3%" 
          positive 
        />
        <StatCard 
          title="Inventory Value" 
          value="₦5.75M" 
          icon={<Package className="text-indigo-600" size={20} />} 
          trend="-2.1%" 
          positive={false} 
        />
        <StatCard 
          title="Monthly Target" 
          value="85%" 
          icon={<Wallet className="text-green-600" size={20} />} 
          trend="+5.2%" 
          positive 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-10">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Weekly Performance</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Revenue trends across major hubs</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-[10px] sm:text-xs font-bold text-slate-900 rounded-xl px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-ubuxa-blue transition-all cursor-pointer hover:border-ubuxa-blue">
              <option className="text-slate-900">Last 7 Days</option>
              <option className="text-slate-900">Last 30 Days</option>
            </select>
          </div>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0077C2" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0077C2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0077C2" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" dot={{ r: 3, fill: '#0077C2', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Sales</h2>
            <button className="text-ubuxa-blue text-xs sm:text-sm font-bold hover:underline px-3 py-1 bg-blue-50 rounded-lg transition-colors">View All</button>
          </div>
          <div className="space-y-6 sm:space-y-8 flex-1">
            <ActivityItem 
              title="Solar Panel 450W" 
              subtitle="To John Doe • ₦150,000" 
              time="2h ago" 
              status="SUCCESS"
            />
            <ActivityItem 
              title="Battery Pack 220Ah" 
              subtitle="To Mary Jane • ₦280,000" 
              time="5h ago" 
              status="PENDING"
            />
            <ActivityItem 
              title="Inverter 5kVA Pro" 
              subtitle="To Collins N. • ₦450,000" 
              time="Yesterday" 
              status="SUCCESS"
            />
          </div>
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-[2rem] border border-slate-100 border-dashed text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performance Insight</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-2">You are 12% ahead of your weekly quota!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend: string, positive: boolean }> = ({ title, value, icon, trend, positive }) => (
  <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-ubuxa-blue transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]">
    <div className="flex justify-between items-start mb-4 sm:mb-6">
      <div className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl group-hover:bg-ubuxa-gradient group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
        {icon}
      </div>
      <button className="text-slate-300 hover:text-slate-900 transition-colors">
        <MoreVertical size={18} />
      </button>
    </div>
    <div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">{title}</p>
      <div className="flex items-baseline space-x-2 mt-1.5 sm:mt-2 overflow-hidden">
        <h3 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight italic">{value}</h3>
        <span className={`text-[9px] sm:text-[11px] font-black flex items-center px-1.5 py-0.5 rounded-lg shrink-0 ${positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {trend}
        </span>
      </div>
    </div>
  </div>
);

const ActivityItem: React.FC<{ title: string, subtitle: string, time: string, status: 'SUCCESS' | 'PENDING' }> = ({ title, subtitle, time, status }) => (
  <div className="flex items-center space-x-4 sm:space-x-5 group cursor-pointer active:bg-slate-50 rounded-xl transition-all">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shrink-0 ${status === 'SUCCESS' ? 'bg-blue-50 text-ubuxa-blue' : 'bg-orange-50 text-orange-600'} group-hover:scale-110 shadow-sm`}>
      <ShoppingCart size={18} sm={20} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-slate-900 leading-none group-hover:text-ubuxa-blue transition-colors truncate">{title}</h4>
      <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 font-medium truncate">{subtitle}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{time}</p>
      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg mt-1 inline-block ${status === 'SUCCESS' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
        {status}
      </span>
    </div>
  </div>
);

export default Dashboard;
