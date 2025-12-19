
import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  // Added ShoppingCart icon import
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value="₦2,250,000" 
          icon={<TrendingUp className="text-blue-600" size={20} />} 
          trend="+12.5%" 
          positive 
        />
        <StatCard 
          title="Active Customers" 
          value="156" 
          icon={<Users className="text-gold" size={20} />} 
          trend="+4.3%" 
          positive 
        />
        <StatCard 
          title="Inventory Value" 
          value="₦5,750,000" 
          icon={<Package className="text-purple-600" size={20} />} 
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Weekly Performance</h2>
            <select className="bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Sales</h2>
            <button className="text-blue-600 text-xs font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            <ActivityItem 
              title="Solar Panel 200W" 
              subtitle="To John Doe • ₦150,000" 
              time="2h ago" 
              status="SUCCESS"
            />
            <ActivityItem 
              title="Battery Pack 100Ah" 
              subtitle="To Mary Jane • ₦280,000" 
              time="5h ago" 
              status="PENDING"
            />
            <ActivityItem 
              title="Inverter 3kVA" 
              subtitle="To Collins N. • ₦450,000" 
              time="Yesterday" 
              status="SUCCESS"
            />
            <ActivityItem 
              title="LED Light Pack" 
              subtitle="To S. Ahmed • ₦15,000" 
              time="Yesterday" 
              status="SUCCESS"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend: string, positive: boolean }> = ({ title, value, icon, trend, positive }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:border-gold transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-gold-gradient transition-all duration-300">
        {icon}
      </div>
      <button className="text-slate-400">
        <MoreVertical size={16} />
      </button>
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <div className="flex items-baseline space-x-2 mt-1">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <span className={`text-xs font-bold flex items-center ${positive ? 'text-green-500' : 'text-red-500'}`}>
          {positive ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
          {trend}
        </span>
      </div>
    </div>
  </div>
);

const ActivityItem: React.FC<{ title: string, subtitle: string, time: string, status: 'SUCCESS' | 'PENDING' }> = ({ title, subtitle, time, status }) => (
  <div className="flex items-center space-x-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
      <ShoppingCart size={18} />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-slate-900 leading-none">{title}</h4>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </div>
    <div className="text-right">
      <p className="text-[10px] font-bold text-slate-400 uppercase">{time}</p>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${status === 'SUCCESS' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
        {status}
      </span>
    </div>
  </div>
);

export default Dashboard;
