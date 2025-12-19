
import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Calendar, 
  DollarSign, 
  Filter, 
  ChevronRight, 
  CheckCircle2,
  Search,
  Package,
  X,
  User,
  Minus,
  Smartphone,
  Check,
  ChevronLeft,
  LayoutGrid,
  List
} from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Kathleen Pfeffer', email: 'angela98@gmail.com', phone: '+234 801 234 5678' },
  { id: '2', name: 'Ericka Considine', email: 'carlo34@yahoo.com', phone: '+234 702 345 6789' },
  { id: '3', name: 'Edmond Schulist', email: 'jude_armstrong@hotmail.com', phone: '+234 903 456 7890' },
];

const MOCK_INVENTORY = [
  { id: 'I1', name: 'Canadian Solar 450W', price: 120000, stock: 150, isSerialize: false },
  { id: 'I2', name: 'Solar Hub Pro v2', price: 85000, stock: 45, isSerialize: true },
  { id: 'I3', name: 'Luminous 220Ah Battery', price: 280000, stock: 12, isSerialize: false },
  { id: 'I4', name: 'Felicity 3.5kVA Inverter', price: 450000, stock: 8, isSerialize: false },
  { id: 'I5', name: 'Charge Controller 60A', price: 45000, stock: 25, isSerialize: false },
];

const MOCK_PACKAGES = [
  { id: 'P1', name: 'Starter Home Bundle', items: ['2x 450W Panel', '1x Solar Hub', '1x Battery'], price: 450000 },
  { id: 'P2', name: 'Elite Power System', items: ['4x 450W Panel', '1x Solar Hub', '2x Battery'], price: 980000 },
];

const MOCK_DEVICES = [
  { sn: 'SN-X91-001', model: 'Solar Hub Pro v2' },
  { sn: 'SN-X91-002', model: 'Solar Hub Pro v2' },
  { sn: 'SN-X91-003', model: 'Solar Hub Pro v2' },
  { sn: 'SN-X91-004', model: 'Solar Hub Pro v2' },
];

const MOCK_SALES = [
  { id: 'SL-2024-001', customer: 'Kathleen Pfeffer', product: 'Starter Home Bundle', amount: 450000, status: 'COMPLETED', date: 'Oct 12, 2024' },
  { id: 'SL-2024-002', customer: 'Ericka Considine', product: 'Solar Hub Pro v2', amount: 85000, status: 'PENDING', date: 'Oct 11, 2024' },
  { id: 'SL-2024-003', customer: 'Edmond Schulist', product: 'Luminous 220Ah Battery', amount: 280000, status: 'COMPLETED', date: 'Oct 10, 2024' },
];

const Sales: React.FC = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [listSearchQuery, setListSearchQuery] = useState('');
  
  // Wizard State
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [assignedDevices, setAssignedDevices] = useState<string[]>([]);
  const [paymentPlan, setPaymentPlan] = useState('OUTRIGHT');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState<'PACKAGE' | 'ITEMS'>('PACKAGE');

  const resetWizard = () => {
    setShowDrawer(false);
    setWizardStep(1);
    setSelectedCustomer(null);
    setCart([]);
    setSelectedPackage(null);
    setAssignedDevices([]);
    setPaymentPlan('OUTRIGHT');
    setSelectionMode('PACKAGE');
  };

  const totalPrice = useMemo(() => {
    if (selectionMode === 'PACKAGE' && selectedPackage) return selectedPackage.price;
    if (selectionMode === 'ITEMS') return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return 0;
  }, [cart, selectedPackage, selectionMode]);

  const updateCart = (item: any, delta: number) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        setCart(cart.filter(c => c.id !== item.id));
      } else {
        setCart(cart.map(c => c.id === item.id ? { ...c, quantity: newQty } : c));
      }
    } else if (delta > 0) {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const needsDevices = useMemo(() => {
    if (selectionMode === 'ITEMS') return cart.some(item => item.isSerialize);
    if (selectionMode === 'PACKAGE' && selectedPackage) return selectedPackage.items.some((i: string) => i.toLowerCase().includes('hub'));
    return false;
  }, [cart, selectedPackage, selectionMode]);

  const handleModeSwitch = (mode: 'PACKAGE' | 'ITEMS') => {
    setSelectionMode(mode);
    if (mode === 'PACKAGE') setCart([]);
    else setSelectedPackage(null);
  };

  // Filter sales based on search query
  const filteredSales = useMemo(() => {
    const query = listSearchQuery.toLowerCase().trim();
    if (!query) return MOCK_SALES;
    return MOCK_SALES.filter(sale => 
      sale.customer.toLowerCase().includes(query) ||
      sale.product.toLowerCase().includes(query) ||
      sale.id.toLowerCase().includes(query)
    );
  }, [listSearchQuery]);

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Sales Record</h2>
          <p className="text-slate-500 text-sm">Monitor your performance and close new deals</p>
        </div>
        <button 
          onClick={() => setShowDrawer(true)}
          className="bg-gold-gradient text-slate-900 px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-gold/20 hover:scale-[1.02] transition-transform"
        >
          <Plus size={20} />
          <span>Record Sale</span>
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Today's Revenue</p>
          <h3 className="text-3xl font-serif font-bold">₦280,000</h3>
          <div className="mt-4 flex items-center space-x-2 text-green-400 text-xs font-bold">
            <CheckCircle2 size={14} />
            <span>2 Successful Deals</span>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem]">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Monthly Goal</p>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-slate-900">₦2.8M / 5M</h3>
            <span className="text-gold font-bold">56%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gold-gradient rounded-full" style={{ width: '56%' }}></div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Active Commissions</p>
              <h3 className="text-3xl font-bold text-slate-900">₦124,500</h3>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <DollarSign size={24} />
            </div>
        </div>
      </div>

      {/* Sales Wizard Side Drawer */}
      <div 
        className={`fixed inset-0 z-[100] transition-visibility duration-300 ${showDrawer ? 'visible' : 'invisible'}`}
      >
        <div 
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${showDrawer ? 'opacity-100' : 'opacity-0'}`}
          onClick={resetWizard}
        />
        
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 transform flex flex-col ${
            showDrawer ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {wizardStep > 1 && (
                  <button onClick={() => setWizardStep(wizardStep - 1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                  </button>
                )}
                <h3 className="text-2xl font-serif font-bold">
                  {wizardStep === 1 ? 'Step 1: Customer' : 
                   wizardStep === 2 ? 'Step 2: Selection' :
                   wizardStep === 3 ? 'Step 3: Devices' : 'Step 4: Review'}
                </h3>
              </div>
              <button onClick={resetWizard} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            {/* Step Indicators */}
            <div className="flex items-center space-x-3 px-1">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${wizardStep >= s ? 'bg-gold w-10' : 'bg-slate-700 w-4'}`}></div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {wizardStep === 1 && (
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search customer pool..." 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:outline-none"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  {MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(customer => (
                    <button 
                      key={customer.id}
                      onClick={() => { setSelectedCustomer(customer); setWizardStep(2); }}
                      className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                        selectedCustomer?.id === customer.id ? 'border-gold bg-gold/5 ring-1 ring-gold/20' : 'border-slate-100 bg-white hover:border-gold'
                      }`}
                    >
                      <div className="flex items-center space-x-4 text-left">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.phone}</p>
                        </div>
                      </div>
                      {selectedCustomer?.id === customer.id && <Check className="text-gold" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Segmented Mode Toggle */}
                <div className="bg-slate-50 p-1 rounded-2xl flex border border-slate-200">
                   <button 
                    onClick={() => handleModeSwitch('PACKAGE')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold transition-all ${selectionMode === 'PACKAGE' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <LayoutGrid size={16} />
                     <span>Bundle Packages</span>
                   </button>
                   <button 
                    onClick={() => handleModeSwitch('ITEMS')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold transition-all ${selectionMode === 'ITEMS' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <List size={16} />
                     <span>Individual Items</span>
                   </button>
                </div>

                {selectionMode === 'PACKAGE' ? (
                  <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Choose a Bundle</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {MOCK_PACKAGES.map(pkg => (
                        <button 
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden ${
                            selectedPackage?.id === pkg.id ? 'border-gold bg-gold/5 shadow-md ring-1 ring-gold/20' : 'border-slate-100 hover:border-gold'
                          }`}
                        >
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                               <p className="font-bold text-slate-900">{pkg.name}</p>
                               <p className="text-gold font-bold">₦{pkg.price.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1.5">
                              {pkg.items.map((item, i) => (
                                <p key={i} className="text-[11px] text-slate-500 flex items-center">
                                  <span className="w-1.5 h-1.5 bg-gold rounded-full mr-2 opacity-60"></span>
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                          {selectedPackage?.id === pkg.id && <CheckCircle2 className="absolute top-4 right-4 text-gold opacity-30" size={40} strokeWidth={1} />}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">A La Carte Selection</h4>
                    <div className="space-y-4">
                      {MOCK_INVENTORY.map(item => {
                        const cartItem = cart.find(c => c.id === item.id);
                        return (
                          <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between hover:border-slate-200 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Package size={24} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                                <p className="text-xs text-gold font-bold">₦{item.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                              <button 
                                onClick={() => updateCart(item, -1)}
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-sm font-bold w-6 text-center">{cartItem?.quantity || 0}</span>
                              <button 
                                onClick={() => updateCart(item, 1)}
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-900 hover:bg-white transition-all shadow-sm"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-6">
                <div className="p-6 bg-slate-900 rounded-[2rem] flex items-center space-x-5 text-white">
                  <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Hardware Selection</p>
                    <p className="text-xs text-slate-400">Choose serial numbers for your devices.</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {MOCK_DEVICES.map(dev => (
                    <button 
                      key={dev.sn}
                      onClick={() => {
                        if (assignedDevices.includes(dev.sn)) setAssignedDevices(assignedDevices.filter(s => s !== dev.sn));
                        else setAssignedDevices([...assignedDevices, dev.sn]);
                      }}
                      className={`w-full p-6 rounded-[2rem] border text-left transition-all flex items-center justify-between group ${
                        assignedDevices.includes(dev.sn) ? 'border-gold bg-gold/5 shadow-md' : 'border-slate-100 bg-white hover:border-gold'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-slate-900">{dev.sn}</p>
                        <p className="text-xs text-slate-500">{dev.model}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                        assignedDevices.includes(dev.sn) ? 'bg-gold border-gold' : 'border-slate-100'
                      }`}>
                        {assignedDevices.includes(dev.sn) && <Check size={14} className="text-slate-900 font-bold" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {wizardStep === 4 && (
              <div className="space-y-8">
                <div className="bg-gold-gradient p-10 rounded-[3rem] text-slate-900 text-center shadow-2xl shadow-gold/20">
                  <p className="font-bold uppercase tracking-widest text-[10px] mb-2 opacity-70">Order Total</p>
                  <h4 className="text-5xl font-serif font-bold">₦{totalPrice.toLocaleString()}</h4>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Summary Review</h5>
                  <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4">
                     <div className="flex justify-between items-center py-2">
                        <span className="text-slate-500 text-sm">Customer</span>
                        <span className="text-slate-900 font-bold text-sm">{selectedCustomer?.name}</span>
                     </div>
                     <div className="flex justify-between items-start py-2 border-t border-slate-200/60 pt-4">
                        <span className="text-slate-500 text-sm">Selection Type</span>
                        <span className="text-slate-900 font-bold text-sm">{selectionMode === 'PACKAGE' ? 'Bundle Package' : 'Custom Items'}</span>
                     </div>
                     <div className="flex justify-between items-start py-2 border-t border-slate-200/60 pt-4">
                        <span className="text-slate-500 text-sm">Selection</span>
                        <span className="text-slate-900 font-bold text-sm text-right max-w-[180px]">
                          {selectionMode === 'PACKAGE' ? selectedPackage?.name : cart.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </span>
                     </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Repayment Structure</h5>
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                      onClick={() => setPaymentPlan('OUTRIGHT')}
                      className={`py-4 rounded-[1.5rem] font-bold transition-all border-2 ${paymentPlan === 'OUTRIGHT' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                     >
                       Full Payment
                     </button>
                     <button 
                      onClick={() => setPaymentPlan('FINANCED')}
                      className={`py-4 rounded-[1.5rem] font-bold transition-all border-2 ${paymentPlan === 'FINANCED' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                     >
                       Pay Small Small
                     </button>
                    </div>
                  </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-slate-100 bg-slate-50">
            <button 
              disabled={(wizardStep === 1 && !selectedCustomer) || (wizardStep === 2 && cart.length === 0 && !selectedPackage)}
              onClick={() => {
                if (wizardStep === 1) setWizardStep(2);
                else if (wizardStep === 2) setWizardStep(needsDevices ? 3 : 4);
                else if (wizardStep === 3) setWizardStep(4);
                else resetWizard();
              }}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {wizardStep === 4 ? 'Complete Transaction' : 'Proceed to Next Step'}
            </button>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900 whitespace-nowrap">Recent Transactions</h3>
          <div className="flex-1 flex items-center space-x-3 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={listSearchQuery}
                onChange={(e) => setListSearchQuery(e.target.value)}
                placeholder="Search by customer, product or ID..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-gold focus:outline-none transition-all"
              />
            </div>
            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-xl transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => (
              <div key={sale.id} className="p-6 lg:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    sale.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 
                    sale.status === 'PENDING' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <ShoppingCart size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{sale.customer}</h4>
                    <p className="text-xs text-slate-500 font-medium">{sale.product} • {sale.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-slate-900 text-lg">₦{sale.amount.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sale.date}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-gold transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
               <Package className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="text-slate-500 font-medium">No transactions match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
