
import React from 'react';
import { Package, Plus, ArrowLeftRight, AlertCircle, ShoppingBag } from 'lucide-react';

const MOCK_INVENTORY = [
  { id: '1', name: 'Canadian Solar 450W Panel', stock: 150, price: 120000, type: 'PRODUCT' },
  { id: '2', name: 'Luminous 220Ah Battery', stock: 45, price: 280000, type: 'BATTERY' },
  { id: '3', name: 'Felicity 5kVA Inverter', stock: 12, price: 550000, type: 'INVERTER' },
  { id: '4', name: 'Solar Cable 4mm (100m)', stock: 8, price: 35000, type: 'ACCESSORY' },
];

const Inventory: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Inventory</h2>
          <p className="text-slate-500 text-sm">Track your assigned stock and request replenishment</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:bg-slate-800 transition-all">
          <ArrowLeftRight size={20} />
          <span>Request Stock</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_INVENTORY.map((item) => (
          <div key={item.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:border-gold transition-all duration-300">
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img src={`https://picsum.photos/seed/${item.id}/400/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
              <div className="absolute top-4 left-4">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                   item.stock < 10 ? 'bg-red-500 text-white' : 'bg-gold-gradient text-slate-900'
                 }`}>
                   {item.type}
                 </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{item.name}</h3>
              <p className="text-gold font-bold text-lg mb-4">₦{item.price.toLocaleString()}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Available Stock</span>
                  <span className={`text-xl font-bold ${item.stock < 10 ? 'text-red-500' : 'text-slate-900'}`}>{item.stock} Units</span>
                </div>
                <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-gold-gradient hover:text-slate-900 transition-all">
                  <ShoppingBag size={18} />
                </button>
              </div>

              {item.stock < 10 && (
                <div className="mt-4 flex items-center space-x-2 text-red-500 bg-red-50 px-3 py-2 rounded-xl">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-bold uppercase">Low Stock Alert</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
