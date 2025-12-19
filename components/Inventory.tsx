
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  ArrowLeftRight, 
  AlertCircle, 
  ShoppingBag, 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  Clock,
  CheckCircle2,
  Truck,
  Building2,
  Search,
  ArrowUpRight,
  ClipboardList
} from 'lucide-react';
import { SideDrawer, PrimaryButton, SecondaryButton, Input, Select, Tabs, Toast } from './Shared';

const MOCK_INVENTORY = [
  { id: '1', name: 'Canadian Solar 450W Panel', stock: 150, price: 120000, type: 'PRODUCT' },
  { id: '2', name: 'Luminous 220Ah Battery', stock: 45, price: 280000, type: 'BATTERY' },
  { id: '3', name: 'Felicity 5kVA Inverter', stock: 12, price: 550000, type: 'INVERTER' },
  { id: '4', name: 'Solar Cable 4mm (100m)', stock: 8, price: 35000, type: 'ACCESSORY' },
  { id: '5', name: 'Smart Meter Pro', stock: 35, price: 15000, type: 'PRODUCT' },
  { id: '6', name: 'Battery Rack 48V', stock: 20, price: 85000, type: 'ACCESSORY' },
];

const MOCK_REQUESTS = [
  { id: 'REQ-001', item: 'Canadian Solar 450W Panel', qty: 50, store: 'Main Hub Lagos', status: 'RECEIVED', date: '2024-03-10' },
  { id: 'REQ-002', item: 'Luminous 220Ah Battery', qty: 20, store: 'Abuja Distribution', status: 'SHIPPED', date: '2024-03-14' },
  { id: 'REQ-003', item: 'Felicity 5kVA Inverter', qty: 5, store: 'Main Hub Lagos', status: 'PENDING', date: '2024-03-15' },
];

const STORES = ['Main Hub Lagos', 'Abuja Distribution', 'Port Harcourt Outlet'];
const ITEMS_PER_PAGE = 4;

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stock');
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ title: string; message: string; type: any } | null>(null);

  // Form State
  const [requestItem, setRequestItem] = useState('');
  const [requestQty, setRequestQty] = useState('');
  const [requestStore, setRequestStore] = useState(STORES[0]);

  const showToast = (title: string, message: string, type: string = 'success') => {
    setToast({ title, message, type });
  };

  const handleRequestSubmit = () => {
    showToast('Request Submitted', `Your request for ${requestQty} units from ${requestStore} is now pending approval.`);
    setIsRequestDrawerOpen(false);
    setRequestItem('');
    setRequestQty('');
  };

  const handleConfirmReceipt = (reqId: string) => {
    showToast('Stock Confirmed', `Inventory for ${reqId} has been added to your local stock.`);
  };

  const totalPages = Math.ceil((activeTab === 'stock' ? MOCK_INVENTORY.length : MOCK_REQUESTS.length) / ITEMS_PER_PAGE);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const source = activeTab === 'stock' ? MOCK_INVENTORY : MOCK_REQUESTS;
    return source.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [activeTab, currentPage]);

  const inventoryTabs = [
    { id: 'stock', label: 'My Local Stock', icon: <Package size={14} /> },
    { id: 'requests', label: 'Restock Requests', icon: <ArrowLeftRight size={14} /> }
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20 lg:pb-8">
      {toast && (
        <Toast 
          title={toast.title} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Inventory Management</h2>
          <p className="text-slate-500 text-sm">Monitor levels and coordinate with your parent store</p>
        </div>
        <div className="flex items-center space-x-3">
          <Tabs tabs={inventoryTabs} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setCurrentPage(1); }} />
          <button 
            onClick={() => setIsRequestDrawerOpen(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:bg-slate-800 transition-all"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Request Stock</span>
          </button>
        </div>
      </div>

      {activeTab === 'stock' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedData.map((item: any) => (
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
                  <div className="mt-4 flex items-center space-x-2 text-red-500 bg-red-50 px-3 py-2 rounded-xl animate-pulse">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-bold uppercase">Critical Low Stock</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedData.map((req: any) => (
            <div key={req.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-gold transition-all">
              <div className="flex items-center space-x-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  req.status === 'PENDING' ? 'bg-slate-50 text-slate-400' : 
                  req.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  {req.status === 'PENDING' ? <Clock size={24} /> : req.status === 'SHIPPED' ? <Truck size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-slate-900">{req.item}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.id}</span>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center space-x-2 mt-0.5">
                    <Building2 size={12} />
                    <span>Requested from: {req.store}</span>
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                     <span className="text-xs font-bold text-slate-900">{req.qty} Units</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${
                  req.status === 'PENDING' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
                  req.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'
                }`}>
                  {req.status}
                </span>
                {req.status === 'SHIPPED' && (
                  <button 
                    onClick={() => handleConfirmReceipt(req.id)}
                    className="px-6 py-2 bg-gold-gradient text-slate-900 rounded-xl font-bold text-xs shadow-md hover:scale-105 transition-transform"
                  >
                    Confirm Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-8 py-6 bg-white rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>
      )}

      {/* SideDrawer for Restock Request */}
      <SideDrawer
        isOpen={isRequestDrawerOpen}
        onClose={() => setIsRequestDrawerOpen(false)}
        title="Stock Allocation Request"
        subtitle="Request new inventory items from your parent distribution hub."
        footer={
          <PrimaryButton 
            className="w-full py-4 text-lg" 
            onClick={handleRequestSubmit}
            disabled={!requestItem || !requestQty}
          >
            Submit Request
          </PrimaryButton>
        }
      >
        <div className="space-y-8">
           <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-start space-x-4">
              <div className="p-2 bg-blue-600 text-white rounded-xl">
                 <ClipboardList size={20} />
              </div>
              <div className="flex-1">
                 <h5 className="text-sm font-bold text-blue-900 leading-tight">Allocation Policy</h5>
                 <p className="text-[11px] text-blue-700 mt-1">Requests are typically approved within 24 hours. Ensure your current sales conversion rates justify the requested volume.</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Target Product</label>
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search inventory items..." 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:outline-none transition-all"
                      value={requestItem}
                      onChange={(e) => setRequestItem(e.target.value)}
                    />
                 </div>
                 {requestItem && (
                   <div className="mt-2 p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">Matched: {requestItem}</span>
                      <CheckCircle2 size={14} className="text-green-500" />
                   </div>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Input 
                   label="Quantity Needed" 
                   type="number" 
                   placeholder="0" 
                   value={requestQty}
                   onChange={(e) => setRequestQty(e.target.value)}
                 />
                 <Select 
                   label="Distribution Hub"
                   value={requestStore}
                   onChange={(e) => setRequestStore(e.target.value)}
                 >
                   {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                 </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Justification (Optional)</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-gold focus:outline-none min-h-[100px] resize-none"
                  placeholder="e.g. Bulk order for Project Alpha..."
                />
              </div>
           </div>

           <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl">
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Allocation Value</p>
                 <h4 className="text-xl font-bold text-gold">₦{((Number(requestQty) || 0) * 120000).toLocaleString()}</h4>
              </div>
              <ArrowUpRight className="text-gold" size={32} strokeWidth={1} />
           </div>
        </div>
      </SideDrawer>
    </div>
  );
};

export default Inventory;
