
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
  Hash
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

  // FIX: Added filteredSales and totalPages to resolve missing variable errors
  const filteredSales = useMemo(() => 
    MOCK_SALES.filter(s => 
      s.customer.toLowerCase().includes(listSearchQuery.toLowerCase()) || 
      s.product.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(listSearchQuery.toLowerCase())
    ),
  [listSearchQuery]);

  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500 pb-20 lg:pb-0">
      {/* Sales Dashboard Content - Keeping it static as requested */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Sales Record</h2>
          <p className="text-slate-500 text-sm">Monitor performance and log new deals</p>
        </div>
        <button 
          onClick={() => setShowDrawer(true)}
          className="bg-gold-gradient text-slate-900 px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.02] transition-transform"
        >
          <Plus size={20} />
          <span>Record Sale</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Today's Revenue</p>
          <h3 className="text-3xl font-serif font-bold">₦280,000</h3>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem]">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Goal Progress</p>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-slate-900">₦2.8M / 5M</h3>
            <span className="text-gold font-bold">56%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gold-gradient rounded-full" style={{ width: '56%' }}></div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Commissions</p>
              <h3 className="text-3xl font-bold text-slate-900">₦124,500</h3>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><DollarSign size={24} /></div>
        </div>
      </div>

      {/* Sales Wizard Side Drawer */}
      <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${showDrawer ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${showDrawer ? 'opacity-100' : 'opacity-0'}`} onClick={resetWizard}/>
        <div className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 transform flex flex-col ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="bg-slate-900 text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {!isSuccess && wizardStep > 1 && (
                  <button onClick={() => setWizardStep(wizardStep - 1)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={24} /></button>
                )}
                <h3 className="text-2xl font-serif font-bold">
                  {isSuccess ? 'Sale Confirmed' : `Step ${wizardStep}: ${['Customer', 'Items', 'Hardware', 'Finalize'][wizardStep - 1]}`}
                </h3>
              </div>
              <button onClick={resetWizard} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
            </div>
            {!isSuccess && (
              <div className="flex items-center space-x-3 px-1">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${wizardStep >= s ? 'bg-gold w-10' : 'bg-slate-700 w-4'}`}></div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-lg"><CheckCircle2 size={48} /></div>
                <div><h4 className="text-2xl font-serif font-bold text-slate-900">Recorded!</h4><p className="text-slate-500 mt-2">Commission is being processed.</p></div>
                <div className="w-full space-y-3 pt-6">
                   <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Download Receipt</button>
                   <button onClick={resetWizard} className="w-full bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold">Close</button>
                </div>
              </div>
            ) : (
              <>
                {wizardStep === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search customer by name or phone..." 
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:outline-none shadow-sm"
                        value={custSearch}
                        onChange={(e) => setCustSearch(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      {filteredCustomers.map(customer => (
                        <button 
                          key={customer.id}
                          onClick={() => { setSelectedCustomer(customer); setWizardStep(2); }}
                          className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between group ${selectedCustomer?.id === customer.id ? 'border-gold bg-gold/5' : 'border-slate-100 bg-white hover:border-gold shadow-sm'}`}
                        >
                          <div className="flex items-center space-x-4 text-left">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors"><User size={20} /></div>
                            <div><p className="font-bold text-slate-900">{customer.name}</p><p className="text-xs text-slate-500">{customer.phone}</p></div>
                          </div>
                          {selectedCustomer?.id === customer.id && <Check className="text-gold" />}
                        </button>
                      ))}
                      {filteredCustomers.length === 0 && <p className="text-center text-slate-400 py-8 text-sm">No customers found.</p>}
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-slate-200 p-1 rounded-2xl flex border border-slate-300">
                       <button onClick={() => setSelectionMode('PACKAGE')} className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all ${selectionMode === 'PACKAGE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}><LayoutGrid size={16} /><span>Bundles</span></button>
                       <button onClick={() => setSelectionMode('ITEMS')} className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all ${selectionMode === 'ITEMS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}><List size={16} /><span>Custom List</span></button>
                    </div>

                    <div className="relative mb-2">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder={selectionMode === 'PACKAGE' ? "Search bundles..." : "Search inventory..."}
                        className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:outline-none shadow-sm text-sm"
                        value={selectionMode === 'PACKAGE' ? pkgSearch : invSearch}
                        onChange={(e) => selectionMode === 'PACKAGE' ? setPkgSearch(e.target.value) : setInvSearch(e.target.value)}
                      />
                    </div>

                    {selectionMode === 'PACKAGE' ? (
                      <div className="space-y-4">
                        {filteredPackages.map(pkg => (
                          <button key={pkg.id} onClick={() => setSelectedPackage(pkg)} className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden w-full ${selectedPackage?.id === pkg.id ? 'border-gold bg-gold/5' : 'border-slate-100 bg-white hover:border-gold shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-2"><p className="font-bold text-slate-900 text-sm">{pkg.name}</p><p className="text-gold font-bold text-sm">₦{pkg.price.toLocaleString()}</p></div>
                            <div className="space-y-1">{pkg.items.slice(0, 2).map((item, i) => <p key={i} className="text-[11px] text-slate-500 flex items-center"><span className="w-1 h-1 bg-gold rounded-full mr-2"></span>{item}</p>)}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredInventory.map(item => {
                          const cartItem = cart.find(c => c.id === item.id);
                          return (
                            <div key={item.id} className="p-4 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Package size={20} /></div>
                                <div><p className="font-bold text-slate-900 text-xs">{item.name}</p><p className="text-[10px] text-gold font-bold">₦{item.price.toLocaleString()}</p></div>
                              </div>
                              <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                                <button onClick={() => updateCart(item, -1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-900"><Minus size={14} /></button>
                                <span className="text-xs font-bold w-4 text-center">{cartItem?.quantity || 0}</span>
                                <button onClick={() => updateCart(item, 1)} className="w-7 h-7 flex items-center justify-center text-slate-900"><Plus size={14} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search device SN or model..." 
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:outline-none shadow-sm"
                        value={devSearch}
                        onChange={(e) => setDevSearch(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      {filteredDevices.map(dev => (
                        <button key={dev.sn} onClick={() => assignedDevices.includes(dev.sn) ? setAssignedDevices(assignedDevices.filter(s => s !== dev.sn)) : setAssignedDevices([...assignedDevices, dev.sn])} className={`w-full p-5 rounded-[2rem] border text-left transition-all flex items-center justify-between ${assignedDevices.includes(dev.sn) ? 'border-gold bg-gold/5' : 'border-slate-100 bg-white hover:border-gold shadow-sm'}`}>
                          <div><p className="font-bold text-slate-900 text-sm">{dev.sn}</p><p className="text-xs text-slate-500">{dev.model}</p></div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${assignedDevices.includes(dev.sn) ? 'bg-gold border-gold' : 'border-slate-100'}`}>{assignedDevices.includes(dev.sn) && <Check size={14} className="text-slate-900" />}</div>
                        </button>
                      ))}
                      {filteredDevices.length === 0 && <p className="text-center text-slate-400 py-8 text-sm">No hardware matched.</p>}
                    </div>
                  </div>
                )}

                {wizardStep === 4 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-gold-gradient p-10 rounded-[3rem] text-slate-900 text-center shadow-2xl">
                      <p className="font-bold uppercase tracking-widest text-[10px] mb-2 opacity-70">Payable Amount</p>
                      <h4 className="text-4xl font-serif font-bold">₦{totalPrice.toLocaleString()}</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white p-6 rounded-[2.5rem] space-y-4 shadow-sm border border-slate-100">
                         <div className="flex justify-between items-center text-sm"><span className="text-slate-500">Client</span><span className="text-slate-900 font-bold">{selectedCustomer?.name}</span></div>
                         <div className="flex justify-between items-start text-sm border-t border-slate-100 pt-4"><span className="text-slate-500">Items</span><span className="text-slate-900 font-bold text-right max-w-[180px]">{selectionMode === 'PACKAGE' ? selectedPackage?.name : cart.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setPaymentPlan('OUTRIGHT')} className={`flex-1 py-4 rounded-[1.5rem] font-bold text-sm transition-all border-2 ${paymentPlan === 'OUTRIGHT' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100'}`}>Outright</button>
                      <button onClick={() => setPaymentPlan('FINANCED')} className={`flex-1 py-4 rounded-[1.5rem] font-bold text-sm transition-all border-2 ${paymentPlan === 'FINANCED' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100'}`}>Financed</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {!isSuccess && (
            <div className="p-8 border-t border-slate-100 bg-white">
              <button 
                disabled={(wizardStep === 1 && !selectedCustomer) || (wizardStep === 2 && cart.length === 0 && !selectedPackage)}
                onClick={() => {
                  if (wizardStep === 1) setWizardStep(2);
                  else if (wizardStep === 2) setWizardStep(needsDevices ? 3 : 4);
                  else if (wizardStep === 3) setWizardStep(4);
                  else completeSale();
                }}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50"
              >
                {wizardStep === 4 ? 'Confirm Sale' : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sales Logs Table Rendering */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900">Recent Logs</h3>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={listSearchQuery}
              onChange={(e) => { setListSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Filter list..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((sale) => (
            <div key={sale.id} onClick={() => setPreviewSale(sale)} className="p-6 lg:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${sale.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}><ShoppingCart size={20} /></div>
                <div><h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{sale.customer}</h4><p className="text-[10px] text-slate-500 font-medium">{sale.product} • {sale.id}</p></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block"><p className="font-bold text-slate-900 text-sm">₦{sale.amount.toLocaleString()}</p></div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-gold" />
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Page {currentPage} / {totalPages}</span>
            <div className="flex space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 disabled:opacity-30"><ChevronLeftIcon size={16} /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 disabled:opacity-30"><ChevronRightIcon size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Sale Detail View Drawer */}
      <SideDrawer isOpen={!!previewSale} onClose={() => setPreviewSale(null)} title="Audit Details" subtitle={`Sale ID: ${previewSale?.id}`}>
        {previewSale && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/20 text-blue-400"><ShoppingCart size={24} /></div>
                <div><h4 className="text-xl font-bold">{previewSale.status}</h4><p className="text-xs text-slate-400 uppercase tracking-widest">{previewSale.date}</p></div>
              </div>
              <div className="text-right"><p className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Total</p><p className="text-xl font-serif font-bold text-gold">₦{previewSale.amount.toLocaleString()}</p></div>
            </div>
            <div className="space-y-3">
               <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Customer Info</h5>
               <div className="p-5 bg-white border border-slate-100 rounded-[2rem] flex items-center space-x-4 shadow-sm">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><User size={20} /></div>
                  <p className="font-bold text-slate-900 text-sm">{previewSale.customer}</p>
               </div>
            </div>
            <div className="space-y-3">
               <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Breakdown</h5>
               <div className="p-5 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-4">
                 <div className="flex justify-between items-center text-xs"><span className="text-slate-500">Product</span><span className="text-slate-900 font-bold">{previewSale.product}</span></div>
                 <div className="flex justify-between items-center border-t border-slate-200 pt-3 text-xs"><span className="text-slate-500">Plan</span><span className="text-slate-900 font-bold">{previewSale.paymentPlan}</span></div>
               </div>
            </div>
          </div>
        )}
      </SideDrawer>
    </div>
  );
};

export default Sales;
