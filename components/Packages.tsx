
import React, { useState, useMemo } from 'react';
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
  ArrowRight
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
];

const INVENTORY_OPTIONS = [
  'Canadian Solar 450W Panel',
  'Solar Hub Pro v2',
  'Luminous 220Ah Battery',
  'Felicity 5kVA Inverter',
  'Solar Cable 4mm',
  'Charge Controller 60A'
];

const Packages: React.FC = () => {
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredPackages = useMemo(() => {
    return MOCK_PACKAGES.filter(pkg => 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.items.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Bundles & Packages</h2>
          <p className="text-slate-500 text-sm">Optimize sales with curated equipment sets.</p>
        </div>
        <PrimaryButton onClick={() => setIsAddDrawerOpen(true)} icon={<Plus size={20} />}>
          Define New Bundle
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Best Selling" 
          value="Eco-Mini Pack" 
          icon={<TrendingUp className="text-blue-600" size={20} />} 
          trend="45 Deals" 
          positive 
        />
        <StatCard 
          title="Average Bundle Value" 
          value="₦716,250" 
          icon={<ShoppingBag className="text-gold" size={20} />} 
        />
        <StatCard 
          title="Active Bundles" 
          value="12 Types" 
          icon={<Layers className="text-purple-600" size={20} />} 
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by bundle name or component..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 flex items-center space-x-2 hover:border-gold transition-colors">
          <Filter size={18} />
          <span>Category</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:border-gold hover:shadow-xl transition-all duration-300 group">
            <div className="p-8 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <div className="flex items-center space-x-2 mb-2">
                     <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest">{pkg.category}</span>
                     {pkg.popular && (
                       <span className="px-2.5 py-1 bg-gold text-slate-900 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center">
                         <CheckCircle2 size={10} className="mr-1" />
                         Popular
                       </span>
                     )}
                   </div>
                   <h3 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-gold transition-colors">{pkg.name}</h3>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-900">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-3 mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Included Hardware</p>
                <div className="grid grid-cols-1 gap-2">
                  {pkg.items.map((item, idx) => (
                    <div key={idx} className="flex items-center text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full mr-3" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bundle Price</p>
                  <p className="text-2xl font-bold text-slate-900">₦{pkg.price.toLocaleString()}</p>
                </div>
                <button className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-gold-gradient hover:text-slate-900 transition-all shadow-lg group-hover:translate-x-1">
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Bundle SideDrawer */}
      <SideDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="New Bundle Definition"
        subtitle="Combine inventory items into a fixed-price sales package."
        footer={
          <PrimaryButton className="w-full py-4 text-lg">
            Save Bundle
          </PrimaryButton>
        }
      >
        <div className="space-y-8">
          <Input label="Bundle Name" placeholder="e.g. Deluxe Home System" icon={<Box size={18} />} />
          
          <div className="space-y-4">
             <MultiSelect 
               label="Select Components" 
               options={INVENTORY_OPTIONS} 
               selected={selectedItems} 
               onChange={setSelectedItems} 
             />
             <p className="text-[10px] text-slate-400 italic px-1 italic">Selecting multiple items will automatically calculate a suggested base price based on inventory unit costs.</p>
          </div>

          <Input label="Custom Package Price (₦)" type="number" placeholder="Enter amount..." icon={<ShoppingBag size={18} />} />

          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200">
             <div className="flex items-center space-x-3 mb-4 text-slate-900">
                <TrendingUp size={18} className="text-gold" />
                <h5 className="font-bold text-sm">Marketing Metadata</h5>
             </div>
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-xs font-medium text-slate-600">Mark as Popular</span>
                 <input type="checkbox" className="w-5 h-5 accent-gold" />
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-xs font-medium text-slate-600">Enable Installment Plan</span>
                 <input type="checkbox" defaultChecked className="w-5 h-5 accent-gold" />
               </div>
             </div>
          </div>
        </div>
      </SideDrawer>
    </div>
  );
};

export default Packages;
