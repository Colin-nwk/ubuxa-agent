
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Package, 
  TrendingUp, 
  CheckCircle2, 
  MoreVertical,
  Layers,
  ShoppingBag,
  ArrowRight,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { SideDrawer, PrimaryButton, Input, MultiSelect, StatCard } from './Shared';

const MOCK_PACKAGES = [
  { 
    id: 'P1', 
    name: 'Starter Home Bundle', 
    items: ['2x 450W Panel', '1x Solar Hub', '1x 100Ah Battery'], 
    price: 450000, 
    popular: true, 
    conversions: 24,
    category: 'Residential'
  },
  { 
    id: 'P2', 
    name: 'Elite Power System', 
    items: ['4x 450W Panel', '1x Solar Hub Pro', '2x 220Ah Battery', '1x 3kVA Inverter'], 
    price: 1250000, 
    popular: false, 
    conversions: 8,
    category: 'Commercial'
  },
  { 
    id: 'P3', 
    name: 'Eco-Mini Pack', 
    items: ['1x 200W Panel', '1x Mini Hub', '1x 50Ah Battery'], 
    price: 185000, 
    popular: true, 
    conversions: 45,
    category: 'Basic'
  },
  { 
    id: 'P4', 
    name: 'Battery Backup Pro', 
    items: ['2x 220Ah Luminous Battery', '1x 5kVA Felicity Inverter'], 
    price: 980000, 
    popular: false, 
    conversions: 12,
    category: 'Add-on'
  },
  { 
    id: 'P5', 
    name: 'Office Energy Plus', 
    items: ['6x 450W Panel', '1x 5kVA Inverter', '4x 200Ah Battery'], 
    price: 1850000, 
    popular: false, 
    conversions: 5,
    category: 'Commercial'
  },
];

const INVENTORY_OPTIONS = [
  'Canadian Solar 450W Panel',
  'Solar Hub Pro v2',
  'Luminous 220Ah Battery',
  'Felicity 5kVA Inverter',
  'Solar Cable 4mm',
  'Charge Controller 60A'
];

const ITEMS_PER_PAGE = 4;

const Packages: React.FC = () => {
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredPackages = useMemo(() => {
    return MOCK_PACKAGES.filter(pkg => 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.items.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const paginatedPackages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPackages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPackages, currentPage]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 lg:pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Bundles</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Configure curated equipment sets for accelerated sales</p>
        </div>
        <PrimaryButton onClick={() => setIsAddDrawerOpen(true)} icon={<Plus size={22} strokeWidth={3} />}>
          New Bundle Definition
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Market Leader" 
          value="Eco-Mini Pack" 
          icon={<TrendingUp className="text-ubuxa-blue" size={24} />} 
          trend="45 Deals" 
          positive 
        />
        <StatCard 
          title="Avg. Transaction" 
          value="₦716,250" 
          icon={<ShoppingBag className="text-ubuxa-blue" size={24} />} 
        />
        <StatCard 
          title="Active Configs" 
          value="12 Bundles" 
          icon={<Layers className="text-blue-600" size={24} />} 
        />
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by bundle name or hardware component..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-ubuxa-blue transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center space-x-3 hover:bg-slate-800 transition-colors shadow-lg">
          <Filter size={20} />
          <span>Category Map</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {paginatedPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden hover:border-ubuxa-blue hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
            <div className="p-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1">
                   <div className="flex items-center space-x-3 mb-4">
                     <span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">{pkg.category}</span>
                     {pkg.popular && (
                       <span className="px-3 py-1 bg-blue-50 text-ubuxa-blue border border-blue-100 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center shadow-sm">
                         <CheckCircle2 size={12} className="mr-1.5" />
                         Trending
                       </span>
                     )}
                   </div>
                   <h3 className="text-3xl font-bold text-slate-900 group-hover:text-ubuxa-blue transition-colors tracking-tight italic">{pkg.name}</h3>
                </div>
                <button className="p-3 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-2xl">
                  <MoreVertical size={24} />
                </button>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-2">System Components</p>
                <div className="grid grid-cols-1 gap-3">
                  {pkg.items.map((item, idx) => (
                    <div key={idx} className="flex items-center text-sm font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
                      <div className="w-2 h-2 bg-ubuxa-blue rounded-full mr-4 shadow-blue-500/20" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-70">Package Value</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter italic">₦{pkg.price.toLocaleString()}</p>
                </div>
                <button className="w-16 h-16 bg-ubuxa-gradient text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-110 active:scale-90 transition-all">
                  <ArrowRight size={32} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="px-10 py-6 bg-white rounded-[3rem] border border-slate-100 flex items-center justify-between shadow-sm">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex space-x-3">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-ubuxa-blue hover:border-ubuxa-blue disabled:opacity-30 transition-all shadow-sm active:scale-90"
            >
              <ChevronLeftIcon size={22} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-ubuxa-blue hover:border-ubuxa-blue disabled:opacity-30 transition-all shadow-sm active:scale-90"
            >
              <ChevronRightIcon size={22} />
            </button>
          </div>
        </div>
      )}

      <SideDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Package Builder"
        subtitle="Initialize a serialized equipment bundle for deployment."
        maxWidth="max-w-xl"
        footer={
          <PrimaryButton className="w-full py-5 text-lg" onClick={() => setIsAddDrawerOpen(false)}>
            Initialize Bundle
          </PrimaryButton>
        }
      >
        <div className="space-y-10">
          <Input label="System Profile Name" placeholder="e.g. Platinum Solar Series" icon={<Box size={22} />} />
          
          <div className="space-y-4">
             <MultiSelect 
               label="Hardware Stack" 
               options={INVENTORY_OPTIONS} 
               selected={selectedItems} 
               onChange={setSelectedItems} 
             />
             <p className="text-[10px] text-slate-400 italic px-2 font-medium">Bundles should include at least one core Hub and one storage unit for PAYGO eligibility.</p>
          </div>

          <Input label="Set Retail Value (₦)" type="number" placeholder="0.00" icon={<ShoppingBag size={22} />} />

          <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] shadow-sm">
             <div className="flex items-center space-x-4 mb-6 text-slate-900">
                <div className="p-2 bg-white rounded-xl shadow-sm"><TrendingUp size={20} className="text-ubuxa-blue" /></div>
                <h5 className="font-bold text-sm uppercase tracking-widest">Visibility Controls</h5>
             </div>
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <span className="text-sm font-bold text-slate-600">Highlight as Trending</span>
                 <input type="checkbox" className="w-6 h-6 rounded-lg accent-ubuxa-blue border-slate-300" />
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm font-bold text-slate-600">Enable Finance Protocol</span>
                 <input type="checkbox" defaultChecked className="w-6 h-6 rounded-lg accent-ubuxa-blue border-slate-300" />
               </div>
             </div>
          </div>
        </div>
      </SideDrawer>
    </div>
  );
};

export default Packages;
