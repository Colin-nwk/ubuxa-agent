
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
  List,
  ArrowRight,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Hash,
  ShoppingBag
} from 'lucide-react';
import { PrimaryButton, SideDrawer, SecondaryButton, Input } from './Shared';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Kathleen Pfeffer', email: 'angela98@gmail.com', phone: '+234 801 234 5678' },
  { id: '2', name: 'Ericka Considine', email: 'carlo34@yahoo.com', phone: '+234 702 345 6789' },
  { id: '3', name: 'Edmond Schulist', email: 'jude_armstrong@hotmail.com', phone: '+234 903 456 7890' },
  { id: '4', name: 'Brionna O\'Keefe', email: 'elnora@hotmail.com', phone: '+234 814 567 8901' },
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
  { id: 'P2', name: 'Elite Power System', items: ['4x 450W Panel', '1x Solar Hub Pro', '2x Battery'], price: 1250000 },
  { id: 'P3', name: 'Basic Light Package', items: ['1x 200W Panel', '1x Controller', '1x LED Pack'], price: 65000 },
];

const MOCK_DEVICES = [
  { sn: 'SN-X91-001', model: 'Solar Hub Pro v2' },
  { sn: 'SN-X91-002', model: 'Solar Hub Pro v2' },
  { sn: 'SN-X91-003', model: 'Solar Hub Pro v2' },
  { sn: 'SN-X91-004', model: 'Solar Hub Pro v2' },
  { sn: 'SN-Z88-005', model: 'Inverter Smart 5k' },
];

const MOCK_SALES = [
  { id: 'SL-2024-001', customer: 'Kathleen Pfeffer', product: 'Starter Home Bundle', amount: 450000, status: 'COMPLETED', date: 'Oct 12, 2024', paymentPlan: 'OUTRIGHT', devices: ['SN-X91-001'] },
  { id: 'SL-2024-002', customer: 'Ericka Considine', product: 'Solar Hub Pro v2', amount: 85000, status: 'PENDING', date: 'Oct 11, 2024', paymentPlan: 'FINANCED', devices: ['SN-X91-002'] },
];

const ITEMS_PER_PAGE = 5;

const Sales: React.FC = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [previewSale, setPreviewSale] = useState<any | null>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Wizard Selection State
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [assignedDevices, setAssignedDevices] = useState<string[]>([]);
  const [paymentPlan, setPaymentPlan] = useState('OUTRIGHT');
  const [selectionMode, setSelectionMode] = useState<'PACKAGE' | 'ITEMS'>('PACKAGE');

  // Wizard Search States
  const [custSearch, setCustSearch] = useState('');
  const [pkgSearch, setPkgSearch] = useState('');
  const [invSearch, setInvSearch] = useState('');
  const [devSearch, setDevSearch] = useState('');

  const resetWizard = () => {
    setShowDrawer(false);
    setWizardStep(1);
    setIsSuccess(false);
    setSelectedCustomer(null);
    setCart([]);
    setSelectedPackage(null);
    setAssignedDevices([]);
    setPaymentPlan('OUTRIGHT');
    setSelectionMode('PACKAGE');
    setCustSearch('');
    setPkgSearch('');
    setInvSearch('');
    setDevSearch('');
  };

  const completeSale = () => {
    setTimeout(() => {
      setIsSuccess(true);
    }, 800);
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
    if (selectionMode === 'PACKAGE' && selectedPackage) return selectedPackage.items.some((i: string) => i.toLowerCase().includes('hub') || i.toLowerCase().includes('inverter'));
    return false;
  }, [cart, selectedPackage, selectionMode]);

  const filteredCustomers = useMemo(() => 
    MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.phone.includes(custSearch)),
  [custSearch]);

  const filteredPackages = useMemo(() => 
    MOCK_PACKAGES.filter(p => p.name.toLowerCase().includes(pkgSearch.toLowerCase())),
  [pkgSearch]);

  const filteredInventory = useMemo(() => 
    MOCK_INVENTORY.filter(i => i.name.toLowerCase().includes(invSearch.toLowerCase())),
  [invSearch]);

  const filteredDevices = useMemo(() => 
    MOCK_DEVICES.filter(d => d.sn.toLowerCase().includes(devSearch.toLowerCase()) || d.model.toLowerCase().includes(devSearch.toLowerCase())),
  [devSearch]);

  const filteredSales = useMemo(() => 
    MOCK_SALES.filter(s => 
      s.customer.toLowerCase().includes(listSearchQuery.toLowerCase()) || 
      s.product.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(listSearchQuery.toLowerCase())
    ),
  [listSearchQuery]);

  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-left-4 duration-500 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Sales Records</h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">Audit transactions and initialize new deployments</p>
        </div>
        <button 
          onClick={() => setShowDrawer(true)}
          className="bg-ubuxa-gradient text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center space-x-2 sm:space-x-3 shadow-xl shadow-ubuxa-blue/20 hover:scale-[1.02] transition-all active:scale-95 text-sm sm:text-base"
        >
          <Plus size={20} sm={22} strokeWidth={3} />
          <span>New Sale</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
        <div className="bg-slate-900 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-ubuxa-blue/10 rounded-full blur-2xl" />
          <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">Today's Revenue</p>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight italic">₦280,000</h3>
        </div>
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-3">Goal Progress</p>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">56%</h3>
            <span className="text-ubuxa-blue font-black text-xs">₦2.8M / 5M</span>
          </div>
          <div className="w-full h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-ubuxa-gradient rounded-full shadow-lg" style={{ width: '56%' }}></div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-between shadow-sm">
            <div>
              <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">Commissions</p>
              <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 italic tracking-tight">₦124,500</h3>
            </div>
            <div className="p-4 sm:p-5 bg-blue-50 text-ubuxa-blue rounded-2xl shrink-0"><DollarSign size={24} sm={28} /></div>
        </div>
      </div>

      {/* Sales Wizard Side Drawer */}
      <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${showDrawer ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-300 ${showDrawer ? 'opacity-100' : 'opacity-0'}`} onClick={resetWizard}/>
        <div className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transition-transform duration-500 transform flex flex-col ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="bg-slate-900 text-white p-6 sm:p-10 shrink-0">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 sm:space-x-5">
                {!isSuccess && wizardStep > 1 && (
                  <button onClick={() => setWizardStep(wizardStep - 1)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={24} sm={28} /></button>
                )}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase italic">
                  {isSuccess ? 'Confirmed' : `Step ${wizardStep}`}
                </h3>
              </div>
              <button onClick={resetWizard} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} sm={28} /></button>
            </div>
            {!isSuccess && (
              <div className="flex items-center space-x-2 px-1">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${wizardStep >= s ? 'bg-ubuxa-blue w-8 sm:w-12 shadow-ubuxa-blue/50 shadow-lg' : 'bg-slate-700 w-3 sm:w-4'}`}></div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-6 sm:space-y-8 bg-slate-50/40 no-scrollbar">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-blue-50 text-ubuxa-blue rounded-3xl flex items-center justify-center shadow-xl shadow-blue-100"><CheckCircle2 size={40} sm={56} /></div>
                <div>
                   <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Deployment Logged</h4>
                   <p className="text-sm sm:text-base text-slate-500 font-medium mt-2 sm:mt-3 px-4">Transaction validated and archived successfully.</p>
                </div>
                <div className="w-full space-y-3 sm:space-y-4 pt-6 sm:pt-10">
                   <button className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl active:scale-95 transition-all">Print Receipt</button>
                   <button onClick={resetWizard} className="w-full bg-slate-200 text-slate-600 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg active:scale-95 transition-all">Close Auditor</button>
                </div>
              </div>
            ) : (
              <>
                {wizardStep === 1 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-2">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900">Select Customer</h4>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Link this transaction to a verified client</p>
                    </div>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search by name..." 
                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-xl sm:rounded-[1.5rem] focus:ring-2 focus:ring-ubuxa-blue focus:outline-none shadow-sm transition-all text-sm"
                        value={custSearch}
                        onChange={(e) => setCustSearch(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {filteredCustomers.map(customer => (
                        <button 
                          key={customer.id}
                          onClick={() => { setSelectedCustomer(customer); setWizardStep(2); }}
                          className={`w-full p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all flex items-center justify-between group text-left active:scale-[0.98] ${selectedCustomer?.id === customer.id ? 'border-ubuxa-blue bg-blue-50 shadow-lg' : 'border-slate-100 bg-white hover:border-ubuxa-blue/50'}`}
                        >
                          <div className="flex items-center space-x-3 sm:space-x-5 min-w-0">
                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shrink-0 ${selectedCustomer?.id === customer.id ? 'bg-ubuxa-blue text-white shadow-lg' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'}`}><User size={20} sm={24} /></div>
                            <div className="min-w-0">
                               <p className={`font-bold text-base sm:text-lg truncate ${selectedCustomer?.id === customer.id ? 'text-ubuxa-blue' : 'text-slate-900'}`}>{customer.name}</p>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 sm:mt-1 truncate">{customer.phone}</p>
                            </div>
                          </div>
                          {selectedCustomer?.id === customer.id && <div className="w-6 h-6 sm:w-8 sm:h-8 bg-ubuxa-blue rounded-full flex items-center justify-center text-white shrink-0"><Check size={14} sm={18} strokeWidth={4} /></div>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900">Inventory Items</h4>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Build a custom set or choose a bundle</p>
                    </div>

                    <div className="bg-slate-200/50 p-1 rounded-xl sm:rounded-[1.5rem] flex border border-slate-200">
                       <button onClick={() => setSelectionMode('PACKAGE')} className={`flex-1 flex items-center justify-center space-x-2 py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${selectionMode === 'PACKAGE' ? 'bg-white text-ubuxa-blue shadow-lg' : 'text-slate-500'}`}><LayoutGrid size={16} /><span>Packages</span></button>
                       <button onClick={() => setSelectionMode('ITEMS')} className={`flex-1 flex items-center justify-center space-x-2 py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${selectionMode === 'ITEMS' ? 'bg-white text-ubuxa-blue shadow-lg' : 'text-slate-500'}`}><List size={16} /><span>Custom</span></button>
                    </div>

                    {selectionMode === 'PACKAGE' ? (
                      <div className="space-y-4">
                        {filteredPackages.map(pkg => (
                          <button 
                            key={pkg.id} 
                            onClick={() => setSelectedPackage(pkg)} 
                            className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 text-left transition-all relative overflow-hidden w-full active:scale-[0.98] ${selectedPackage?.id === pkg.id ? 'border-ubuxa-blue bg-blue-50 shadow-xl' : 'border-slate-100 bg-white hover:border-ubuxa-blue/50'}`}
                          >
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                               <div className="min-w-0">
                                  <p className={`font-bold text-base sm:text-lg truncate ${selectedPackage?.id === pkg.id ? 'text-ubuxa-blue' : 'text-slate-900'}`}>{pkg.name}</p>
                                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 italic">Bundle</p>
                               </div>
                               <p className="text-ubuxa-blue font-black text-lg sm:text-xl italic shrink-0">₦{pkg.price.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                               {pkg.items.slice(0, 3).map((item, i) => (
                                 <p key={i} className="text-[10px] sm:text-[11px] text-slate-500 font-bold flex items-center truncate">
                                   <div className={`w-1.5 h-1.5 rounded-full mr-2 sm:mr-3 shrink-0 ${selectedPackage?.id === pkg.id ? 'bg-ubuxa-blue' : 'bg-slate-300'}`}></div>
                                   {item}
                                 </p>
                               ))}
                            </div>
                            {selectedPackage?.id === pkg.id && (
                               <div className="absolute top-3 right-3 sm:top-4 sm:right-4 animate-in zoom-in">
                                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-ubuxa-blue rounded-full flex items-center justify-center text-white"><Check size={12} sm={14} strokeWidth={4} /></div>
                               </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredInventory.map(item => {
                          const cartItem = cart.find(c => c.id === item.id);
                          const isActive = (cartItem?.quantity || 0) > 0;
                          return (
                            <div key={item.id} className={`p-4 sm:p-6 border-2 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-between transition-all ${isActive ? 'bg-blue-50 border-ubuxa-blue shadow-lg' : 'bg-white border-slate-100'}`}>
                              <div className="flex items-center space-x-3 sm:space-x-5 min-w-0">
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner transition-colors shrink-0 ${isActive ? 'bg-ubuxa-blue text-white' : 'bg-slate-50 text-slate-400'}`}><Package size={20} sm={28} /></div>
                                <div className="min-w-0">
                                   <p className="font-bold text-slate-900 text-sm truncate">{item.name}</p>
                                   <p className="text-[10px] sm:text-[11px] text-ubuxa-blue font-black tracking-tight mt-0.5">₦{item.price.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 sm:space-x-3 bg-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
                                <button onClick={() => updateCart(item, -1)} className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-red-500 active:scale-90 transition-colors"><Minus size={16} /></button>
                                <span className="text-xs sm:text-sm font-black w-4 sm:w-6 text-center text-slate-900">{cartItem?.quantity || 0}</span>
                                <button onClick={() => updateCart(item, 1)} className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-ubuxa-blue active:scale-125 transition-all"><Plus size={16} sm={18} strokeWidth={3} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900">Hardware Assignment</h4>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Scan or select device units</p>
                    </div>
                    <div className="space-y-3">
                      {filteredDevices.map(dev => (
                        <button 
                          key={dev.sn} 
                          onClick={() => assignedDevices.includes(dev.sn) ? setAssignedDevices(assignedDevices.filter(s => s !== dev.sn)) : setAssignedDevices([...assignedDevices, dev.sn])} 
                          className={`w-full p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 text-left transition-all flex items-center justify-between group active:scale-[0.98] ${assignedDevices.includes(dev.sn) ? 'border-ubuxa-blue bg-blue-50 shadow-xl' : 'border-slate-100 bg-white hover:border-ubuxa-blue/50'}`}
                        >
                          <div className="flex items-center space-x-4 sm:space-x-5 min-w-0">
                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${assignedDevices.includes(dev.sn) ? 'bg-ubuxa-blue text-white' : 'bg-slate-50 text-slate-400'}`}><Smartphone size={20} sm={28} /></div>
                            <div className="min-w-0">
                               <p className="font-mono font-black text-slate-900 text-sm sm:text-[15px] truncate">{dev.sn}</p>
                               <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">{dev.model}</p>
                            </div>
                          </div>
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${assignedDevices.includes(dev.sn) ? 'bg-ubuxa-blue border-ubuxa-blue shadow-lg' : 'border-slate-200'}`}>
                             {assignedDevices.includes(dev.sn) && <Check size={14} sm={18} className="text-white" strokeWidth={4} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 4 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-ubuxa-gradient p-8 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] text-white text-center shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                      <p className="font-black uppercase tracking-[0.2em] text-[9px] sm:text-[11px] mb-3 sm:mb-4 opacity-80">Final Valuation</p>
                      <h4 className="text-4xl sm:text-5xl font-bold italic tracking-tighter">₦{totalPrice.toLocaleString()}</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] space-y-4 sm:space-y-6 shadow-sm border border-slate-100">
                         <div className="flex justify-between items-center"><span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Client</span><span className="text-slate-900 font-bold text-sm">{selectedCustomer?.name}</span></div>
                         <div className="flex justify-between items-start border-t border-slate-100 pt-4 sm:pt-6"><span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Config</span><span className="text-slate-900 font-bold text-right max-w-[150px] sm:max-w-[200px] text-xs sm:text-sm line-clamp-2">{selectionMode === 'PACKAGE' ? selectedPackage?.name : cart.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-3">Payment Protocol</p>
                       <div className="flex gap-2 sm:gap-4 p-1.5 sm:p-2 bg-slate-100 rounded-xl sm:rounded-[2rem] border border-slate-200">
                         <button onClick={() => setPaymentPlan('OUTRIGHT')} className={`flex-1 py-3 sm:py-4 rounded-lg sm:rounded-[1.5rem] font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all ${paymentPlan === 'OUTRIGHT' ? 'bg-white text-ubuxa-blue shadow-lg' : 'text-slate-500'}`}>Outright</button>
                         <button onClick={() => setPaymentPlan('FINANCED')} className={`flex-1 py-3 sm:py-4 rounded-lg sm:rounded-[1.5rem] font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all ${paymentPlan === 'FINANCED' ? 'bg-white text-ubuxa-blue shadow-lg' : 'text-slate-500'}`}>Financed</button>
                       </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {!isSuccess && (
            <div className="p-6 sm:p-10 border-t border-slate-100 bg-white shrink-0">
              <button 
                disabled={(wizardStep === 1 && !selectedCustomer) || (wizardStep === 2 && cart.length === 0 && !selectedPackage)}
                onClick={() => {
                  if (wizardStep === 1) setWizardStep(2);
                  else if (wizardStep === 2) setWizardStep(needsDevices ? 3 : 4);
                  else if (wizardStep === 3) setWizardStep(4);
                  else completeSale();
                }}
                className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl disabled:opacity-40 transition-all active:scale-95"
              >
                {wizardStep === 4 ? 'Confirm & Deploy' : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sales Logs - Optimized List for mobile */}
      <div className="bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
             <div className="p-2 sm:p-3 bg-blue-50 text-ubuxa-blue rounded-lg sm:rounded-xl shrink-0"><Hash size={18} sm={20} /></div>
             <h3 className="font-bold text-slate-900 text-base sm:text-lg">Recent Archive</h3>
          </div>
          <div className="relative group w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={16} />
            <input 
              type="text" 
              value={listSearchQuery}
              onChange={(e) => { setListSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] sm:text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-ubuxa-blue transition-all"
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((sale) => (
            <div key={sale.id} onClick={() => setPreviewSale(sale)} className="p-5 sm:p-8 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group active:bg-slate-100">
              <div className="flex items-center space-x-4 sm:space-x-8 min-w-0">
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0 ${sale.status === 'COMPLETED' ? 'bg-blue-50 text-ubuxa-blue' : 'bg-slate-100 text-slate-400'}`}><ShoppingCart size={20} sm={24} /></div>
                <div className="min-w-0">
                   <h4 className="font-bold text-slate-900 text-sm sm:text-lg group-hover:text-ubuxa-blue transition-colors tracking-tight truncate">{sale.customer}</h4>
                   <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 truncate">{sale.product} • <span className="text-slate-500">{sale.id}</span></p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-8 shrink-0">
                <div className="text-right hidden sm:block">
                   <p className="font-black text-slate-900 text-lg italic tracking-tight">₦{sale.amount.toLocaleString()}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{sale.date}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-ubuxa-blue group-hover:text-white transition-all"><ChevronRight size={18} sm={22} /></div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-4 sm:px-10 sm:py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
            <div className="flex space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 disabled:opacity-30 hover:border-ubuxa-blue active:scale-90 transition-all shadow-sm"><ChevronLeftIcon size={18} /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 disabled:opacity-30 hover:border-ubuxa-blue active:scale-90 transition-all shadow-sm"><ChevronRightIcon size={18} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
