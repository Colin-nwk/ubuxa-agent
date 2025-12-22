
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  DollarSign, 
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
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Hash,
  Clock,
  FileText,
  Calendar,
  MapPin,
  PenTool
} from 'lucide-react';
import { BottomSheetModal, PrimaryButton, SecondaryButton, Input, SignaturePad } from './Shared';
import { getAllFromStore, addItemToStore, addToSyncQueue } from '../utils/db';

const ITEMS_PER_PAGE = 5;

const Sales: React.FC = () => {
  // DB Data State
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);
  const [dbInventory, setDbInventory] = useState<any[]>([]);
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [dbDevices, setDbDevices] = useState<any[]>([]);
  const [dbSales, setDbSales] = useState<any[]>([]);

  const [showDrawer, setShowDrawer] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSaleDetails, setSelectedSaleDetails] = useState<any>(null);
  
  // Wizard Selection State
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [assignedDevices, setAssignedDevices] = useState<string[]>([]);
  const [paymentPlan, setPaymentPlan] = useState('OUTRIGHT');
  const [selectionMode, setSelectionMode] = useState<'PACKAGE' | 'ITEMS'>('PACKAGE');
  
  // New States for Extended Flow
  const [installAddress, setInstallAddress] = useState('');
  const [installDate, setInstallDate] = useState('');
  const [signature, setSignature] = useState<string | null>(null);

  // Wizard Search States
  const [custSearch, setCustSearch] = useState('');
  const [pkgSearch, setPkgSearch] = useState('');
  const [invSearch, setInvSearch] = useState('');
  const [devSearch, setDevSearch] = useState('');

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [c, i, p, d, s] = await Promise.all([
                getAllFromStore('customers'),
                getAllFromStore('inventory'),
                getAllFromStore('packages'),
                getAllFromStore('devices'),
                getAllFromStore('sales')
            ]);
            setDbCustomers(c);
            setDbInventory(i);
            setDbPackages(p);
            setDbDevices(d);
            setDbSales(s.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (e) {
            console.error("Failed to load DB data", e);
        }
    };
    fetchData();
  }, [isSuccess]); // Refresh after successful sale

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
    setInstallAddress('');
    setInstallDate('');
    setSignature(null);
    setCustSearch('');
    setPkgSearch('');
    setInvSearch('');
    setDevSearch('');
  };

  const completeSale = async () => {
    const newSale = {
        id: `SL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: selectedCustomer?.name,
        customerId: selectedCustomer?.id,
        product: selectionMode === 'PACKAGE' ? selectedPackage?.name : 'Custom Bundle',
        amount: totalPrice,
        status: navigator.onLine ? 'COMPLETED' : 'PENDING',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        paymentPlan: paymentPlan,
        devices: assignedDevices,
        installAddress,
        installDate,
        signature
    };

    // Save to local DB
    await addItemToStore('sales', newSale);

    // If offline, add to sync queue
    if (!navigator.onLine) {
        await addToSyncQueue({ type: 'CREATE_SALE', payload: newSale });
    }

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
    dbCustomers.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.phone.includes(custSearch)),
  [dbCustomers, custSearch]);

  const filteredPackages = useMemo(() => 
    dbPackages.filter(p => p.name.toLowerCase().includes(pkgSearch.toLowerCase())),
  [dbPackages, pkgSearch]);

  const filteredInventory = useMemo(() => 
    dbInventory.filter(i => i.name.toLowerCase().includes(invSearch.toLowerCase())),
  [dbInventory, invSearch]);

  const filteredDevices = useMemo(() => 
    dbDevices.filter(d => d.sn.toLowerCase().includes(devSearch.toLowerCase()) || d.model.toLowerCase().includes(devSearch.toLowerCase())),
  [dbDevices, devSearch]);

  const filteredSales = useMemo(() => 
    dbSales.filter(s => 
      s.customer.toLowerCase().includes(listSearchQuery.toLowerCase()) || 
      s.product.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(listSearchQuery.toLowerCase())
    ),
  [dbSales, listSearchQuery]);

  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

  // Flow Navigation Logic
  const handleNext = () => {
    if (wizardStep === 1 && selectedCustomer) {
        setInstallAddress(selectedCustomer.address || ''); 
        setWizardStep(2);
    } 
    else if (wizardStep === 2) setWizardStep(3); // To Logistics
    else if (wizardStep === 3) setWizardStep(needsDevices ? 4 : 5); // Skip HW if not needed
    else if (wizardStep === 4) setWizardStep(5); // To Contract
    else if (wizardStep === 5) setWizardStep(6); // To Final
    else completeSale();
  };

  const handleBack = () => {
      if (wizardStep === 5 && !needsDevices) setWizardStep(3);
      else setWizardStep(prev => prev - 1);
  };

  // Step Validation
  const isStepValid = () => {
      if (wizardStep === 1) return !!selectedCustomer;
      if (wizardStep === 2) return cart.length > 0 || !!selectedPackage;
      if (wizardStep === 3) return installAddress.length > 3 && !!installDate;
      if (wizardStep === 4) return true; // Optional generally, or validated by logic
      if (wizardStep === 5) return !!signature;
      return true;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-left-4 duration-500 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Sales Records</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-1">Audit transactions and initialize new deployments</p>
        </div>
        <button 
          onClick={() => setShowDrawer(true)}
          className="bg-ubuxa-gradient text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center space-x-2 sm:space-x-3 shadow-xl shadow-ubuxa-blue/20 hover:scale-[1.02] transition-all active:scale-95 text-sm sm:text-base"
        >
          <Plus size={20} strokeWidth={3} />
          <span>New Sale</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
        <div className="bg-slate-900 dark:bg-slate-950 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-ubuxa-blue/10 rounded-full blur-2xl" />
          <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">Today's Revenue</p>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight italic">₦280,000</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-3">Goal Progress</p>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">56%</h3>
            <span className="text-ubuxa-blue font-black text-xs">₦2.8M / 5M</span>
          </div>
          <div className="w-full h-2 sm:h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-ubuxa-gradient rounded-full shadow-lg" style={{ width: '56%' }}></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-between shadow-sm">
            <div>
              <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">Commissions</p>
              <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white italic tracking-tight">₦124,500</h3>
            </div>
            <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 text-ubuxa-blue rounded-2xl shrink-0"><DollarSign className="w-6 h-6 sm:w-7 sm:h-7" /></div>
        </div>
      </div>

      {/* Sales Wizard Side Drawer */}
      <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${showDrawer ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-300 ${showDrawer ? 'opacity-100' : 'opacity-0'}`} onClick={resetWizard}/>
        <div className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 transform flex flex-col ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 sm:p-10 shrink-0">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 sm:space-x-5">
                {!isSuccess && wizardStep > 1 && (
                  <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={24} /></button>
                )}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase italic">
                  {isSuccess ? 'Confirmed' : `Step ${wizardStep} of 6`}
                </h3>
              </div>
              <button onClick={resetWizard} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
            </div>
            {!isSuccess && (
              <div className="flex items-center space-x-1.5 px-1">
                {[1, 2, 3, 4, 5, 6].map(s => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${
                    wizardStep >= s 
                      ? 'bg-ubuxa-blue shadow-ubuxa-blue/50 shadow-lg' 
                      : 'bg-slate-700'
                  } ${wizardStep === s ? 'w-8 sm:w-10' : 'w-2 sm:w-3'}`}></div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-6 sm:space-y-8 bg-slate-50/40 dark:bg-slate-950/20 no-scrollbar">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-blue-50 dark:bg-blue-900/30 text-ubuxa-blue rounded-3xl flex items-center justify-center shadow-xl shadow-blue-100 dark:shadow-blue-900/20"><CheckCircle2 size={40} /></div>
                <div>
                   <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Deployment Logged</h4>
                   <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-2 sm:mt-3 px-4">
                     {navigator.onLine ? 'Transaction validated and archived successfully.' : 'Transaction saved offline. It will sync when connection restores.'}
                   </p>
                </div>
                <div className="w-full space-y-3 sm:space-y-4 pt-6 sm:pt-10">
                   <button className="w-full bg-slate-900 dark:bg-slate-800 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl active:scale-95 transition-all">Print Receipt</button>
                   <button onClick={resetWizard} className="w-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg active:scale-95 transition-all">Close Auditor</button>
                </div>
              </div>
            ) : (
              <>
                {/* Step 1: Customer Selection */}
                {wizardStep === 1 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-2">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Select Customer</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Link this transaction to a verified client</p>
                    </div>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search by name..." 
                        className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.5rem] focus:ring-2 focus:ring-ubuxa-blue focus:outline-none shadow-sm transition-all text-sm text-slate-900 dark:text-white"
                        value={custSearch}
                        onChange={(e) => setCustSearch(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {filteredCustomers.map(customer => (
                        <button 
                          key={customer.id}
                          onClick={() => { setSelectedCustomer(customer); setInstallAddress(customer.address); setWizardStep(2); }}
                          className={`w-full p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all flex items-center justify-between group text-left active:scale-[0.98] ${selectedCustomer?.id === customer.id ? 'border-ubuxa-blue bg-blue-50 dark:bg-blue-900/30 shadow-xl' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-ubuxa-blue/50'}`}
                        >
                          <div className="flex items-center space-x-3 sm:space-x-5 min-w-0">
                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shrink-0 ${selectedCustomer?.id === customer.id ? 'bg-ubuxa-blue text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-slate-900 dark:group-hover:bg-slate-900 group-hover:text-white'}`}><User size={20} /></div>
                            <div className="min-w-0">
                               <p className={`font-bold text-base sm:text-lg truncate ${selectedCustomer?.id === customer.id ? 'text-ubuxa-blue' : 'text-slate-900 dark:text-white'}`}>{customer.name}</p>
                               <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5 sm:mt-1 truncate">{customer.phone}</p>
                            </div>
                          </div>
                          {selectedCustomer?.id === customer.id && <div className="w-6 h-6 sm:w-8 sm:h-8 bg-ubuxa-blue rounded-full flex items-center justify-center text-white shrink-0"><Check size={14} strokeWidth={4} /></div>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Inventory Selection */}
                {wizardStep === 2 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Inventory Items</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Build a custom set or choose a bundle</p>
                    </div>

                    <div className="bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl sm:rounded-[1.5rem] flex border border-slate-200 dark:border-slate-700">
                       <button onClick={() => setSelectionMode('PACKAGE')} className={`flex-1 flex items-center justify-center space-x-2 py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${selectionMode === 'PACKAGE' ? 'bg-white dark:bg-slate-700 text-ubuxa-blue dark:text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}><LayoutGrid size={16} /><span>Packages</span></button>
                       <button onClick={() => setSelectionMode('ITEMS')} className={`flex-1 flex items-center justify-center space-x-2 py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${selectionMode === 'ITEMS' ? 'bg-white dark:bg-slate-700 text-ubuxa-blue dark:text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}><List size={16} /><span>Custom</span></button>
                    </div>

                    {selectionMode === 'PACKAGE' ? (
                      <div className="space-y-4">
                        {filteredPackages.map(pkg => (
                          <button 
                            key={pkg.id} 
                            onClick={() => setSelectedPackage(pkg)} 
                            className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 text-left transition-all relative overflow-hidden w-full active:scale-[0.98] ${selectedPackage?.id === pkg.id ? 'border-ubuxa-blue bg-blue-50 dark:bg-blue-900/30 shadow-xl' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-ubuxa-blue/50'}`}
                          >
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                               <div className="min-w-0">
                                  <p className={`font-bold text-base sm:text-lg truncate ${selectedPackage?.id === pkg.id ? 'text-ubuxa-blue' : 'text-slate-900 dark:text-white'}`}>{pkg.name}</p>
                                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 italic">Bundle</p>
                                </div>
                               <p className="text-ubuxa-blue font-black text-lg sm:text-xl italic shrink-0">₦{pkg.price.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                               {pkg.items.slice(0, 3).map((item: string, i: number) => (
                                 <p key={i} className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold flex items-center truncate">
                                   <span className={`w-1.5 h-1.5 rounded-full mr-2 sm:mr-3 shrink-0 ${selectedPackage?.id === pkg.id ? 'bg-ubuxa-blue' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                                   {item}
                                 </p>
                               ))}
                            </div>
                            {selectedPackage?.id === pkg.id && (
                               <div className="absolute top-3 right-3 sm:top-4 sm:right-4 animate-in zoom-in">
                                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-ubuxa-blue rounded-full flex items-center justify-center text-white"><Check size={12} strokeWidth={4} /></div>
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
                            <div key={item.id} className={`p-4 sm:p-6 border-2 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-between transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 border-ubuxa-blue shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800'}`}>
                              <div className="flex items-center space-x-3 sm:space-x-5 min-w-0">
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner transition-colors shrink-0 ${isActive ? 'bg-ubuxa-blue text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}><Package size={20} /></div>
                                <div className="min-w-0">
                                   <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.name}</p>
                                   <p className="text-[10px] sm:text-[11px] text-ubuxa-blue font-black tracking-tight mt-0.5">₦{item.price.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-slate-900 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <button onClick={() => updateCart(item, -1)} className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-red-500 active:scale-90 transition-colors"><Minus size={16} /></button>
                                <span className="text-xs sm:text-sm font-black w-4 sm:w-6 text-center text-slate-900 dark:text-white">{cartItem?.quantity || 0}</span>
                                <button onClick={() => updateCart(item, 1)} className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-ubuxa-blue active:scale-125 transition-all"><Plus size={16} strokeWidth={3} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Installation Logistics */}
                {wizardStep === 3 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Installation Logistics</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Schedule the deployment details</p>
                    </div>

                    <div className="space-y-6">
                        <Input 
                            label="Installation Address" 
                            icon={<MapPin size={18} />} 
                            value={installAddress}
                            onChange={(e) => setInstallAddress(e.target.value)}
                            placeholder="Enter street address"
                        />
                        <Input 
                            label="Preferred Date" 
                            type="date"
                            icon={<Calendar size={18} />} 
                            value={installDate}
                            onChange={(e) => setInstallDate(e.target.value)}
                        />
                        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-start space-x-3">
                                <Clock className="text-ubuxa-blue mt-0.5" size={18} />
                                <div>
                                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">Deployment SLA</h5>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                        Standard installation takes 4-6 hours. Please ensure the site is accessible during this window.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Hardware Assignment */}
                {wizardStep === 4 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Hardware Assignment</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Scan or select device units</p>
                    </div>
                    <div className="space-y-3">
                      {filteredDevices.map(dev => (
                        <button 
                          key={dev.sn} 
                          onClick={() => assignedDevices.includes(dev.sn) ? setAssignedDevices(assignedDevices.filter(s => s !== dev.sn)) : setAssignedDevices([...assignedDevices, dev.sn])} 
                          className={`w-full p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 text-left transition-all flex items-center justify-between group active:scale-[0.98] ${assignedDevices.includes(dev.sn) ? 'border-ubuxa-blue bg-blue-50 dark:bg-blue-900/30 shadow-xl' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-ubuxa-blue/50'}`}
                        >
                          <div className="flex items-center space-x-4 sm:space-x-5 min-w-0">
                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${assignedDevices.includes(dev.sn) ? 'bg-ubuxa-blue text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}><Smartphone size={20} /></div>
                            <div className="min-w-0">
                               <p className="font-mono font-black text-slate-900 dark:text-white text-sm sm:text-[15px] truncate">{dev.sn}</p>
                               <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">{dev.model}</p>
                            </div>
                          </div>
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${assignedDevices.includes(dev.sn) ? 'bg-ubuxa-blue border-ubuxa-blue shadow-lg' : 'border-slate-200 dark:border-slate-700'}`}>
                             {assignedDevices.includes(dev.sn) && <Check size={14} className="text-white" strokeWidth={4} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Digital Contract */}
                {wizardStep === 5 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Digital Contract</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Customer acknowledgement of terms</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700 h-32 overflow-y-auto">
                            <p><strong>1. Payment Obligations:</strong> The customer agrees to the total valuation of ₦{totalPrice.toLocaleString()}. For financed plans, monthly remittances must be made by the 5th of each month.</p>
                            <p className="mt-2"><strong>2. Ownership:</strong> Title to the equipment remains with UBUXA until full payment is completed. Any attempt to tamper with the device lock will void warranty.</p>
                            <p className="mt-2"><strong>3. Service:</strong> UBUXA provides 1 year of free maintenance. Physical damage is not covered.</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
                            <PenTool size={16} className="text-ubuxa-blue" />
                            <span>Customer Signature</span>
                        </div>
                        <SignaturePad 
                            onChange={(sig) => setSignature(sig)} 
                        />
                        {signature && (
                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-xs font-bold justify-center">
                                <CheckCircle2 size={14} />
                                <span>Signature Captured</span>
                            </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Step 6: Final Valuation */}
                {wizardStep === 6 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-ubuxa-gradient p-8 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] text-white text-center shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                      <p className="font-black uppercase tracking-[0.2em] text-[9px] sm:text-[11px] mb-3 sm:mb-4 opacity-80">Final Valuation</p>
                      <h4 className="text-4xl sm:text-5xl font-bold italic tracking-tighter">₦{totalPrice.toLocaleString()}</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] space-y-4 sm:space-y-6 shadow-sm border border-slate-100 dark:border-slate-700">
                         <div className="flex justify-between items-center"><span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Client</span><span className="text-slate-900 dark:text-white font-bold text-sm">{selectedCustomer?.name}</span></div>
                         <div className="flex justify-between items-start border-t border-slate-100 dark:border-slate-700 pt-4 sm:pt-6"><span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Config</span><span className="text-slate-900 dark:text-white font-bold text-right max-w-[150px] sm:max-w-[200px] text-xs sm:text-sm line-clamp-2">{selectionMode === 'PACKAGE' ? selectedPackage?.name : cart.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span></div>
                         <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-4 sm:pt-6">
                            <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Install</span>
                            <div className="text-right">
                                <span className="block text-slate-900 dark:text-white font-bold text-sm">{installDate}</span>
                                <span className="block text-xs text-slate-500 truncate max-w-[150px]">{installAddress}</span>
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-3">Payment Protocol</p>
                       <div className="flex gap-2 sm:gap-4 p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-[2rem] border border-slate-200 dark:border-slate-700">
                         <button onClick={() => setPaymentPlan('OUTRIGHT')} className={`flex-1 py-3 sm:py-4 rounded-lg sm:rounded-[1.5rem] font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all ${paymentPlan === 'OUTRIGHT' ? 'bg-white dark:bg-slate-700 text-ubuxa-blue dark:text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}>Outright</button>
                         <button onClick={() => setPaymentPlan('FINANCED')} className={`flex-1 py-3 sm:py-4 rounded-lg sm:rounded-[1.5rem] font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all ${paymentPlan === 'FINANCED' ? 'bg-white dark:bg-slate-700 text-ubuxa-blue dark:text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}>Financed</button>
                       </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {!isSuccess && (
            <div className="p-6 sm:p-10 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <button 
                disabled={!isStepValid()}
                onClick={handleNext}
                className="w-full bg-slate-900 dark:bg-slate-800 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl disabled:opacity-40 transition-all active:scale-95"
              >
                {wizardStep === 6 ? 'Confirm & Deploy' : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sales Logs */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
             <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/30 text-ubuxa-blue rounded-lg sm:rounded-xl shrink-0"><Hash size={18} /></div>
             <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">Recent Archive</h3>
          </div>
          <div className="relative group w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={16} />
            <input 
              type="text" 
              value={listSearchQuery}
              onChange={(e) => { setListSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ubuxa-blue transition-all"
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((sale) => (
            <div key={sale.id} onClick={() => setSelectedSaleDetails(sale)} className="p-5 sm:p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group active:bg-slate-100 dark:active:bg-slate-800">
              <div className="flex items-center space-x-4 sm:space-x-8 min-w-0">
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0 ${sale.status === 'COMPLETED' ? 'bg-blue-50 dark:bg-blue-900/30 text-ubuxa-blue' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}><ShoppingCart size={20} /></div>
                <div className="min-w-0">
                   <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-lg group-hover:text-ubuxa-blue transition-colors tracking-tight truncate">{sale.customer}</h4>
                   <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 truncate">{sale.product} • <span className="text-slate-500">{sale.id}</span></p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-8 shrink-0">
                <div className="text-right hidden sm:block">
                   <p className="font-black text-slate-900 dark:text-white text-lg italic tracking-tight">₦{sale.amount.toLocaleString()}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{sale.date}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 dark:bg-slate-800 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-ubuxa-blue group-hover:text-white transition-all"><ChevronRightIcon size={18} /></div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-4 sm:px-10 sm:py-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
            <div className="flex space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 disabled:opacity-30 hover:border-ubuxa-blue active:scale-90 transition-all shadow-sm"><ChevronLeftIcon size={18} /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 disabled:opacity-30 hover:border-ubuxa-blue active:scale-90 transition-all shadow-sm"><ChevronRightIcon size={18} /></button>
            </div>
          </div>
        )}
      </div>

      <BottomSheetModal
        isOpen={!!selectedSaleDetails}
        onClose={() => setSelectedSaleDetails(null)}
        title="Transaction Details"
      >
        {selectedSaleDetails && (
          <div className="space-y-6">
             {/* Status & Amount Header */}
             <div className={`p-6 rounded-2xl flex items-center justify-between ${selectedSaleDetails.status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'}`}>
                <div className="flex items-center space-x-3">
                   <div className={`p-2 rounded-full ${selectedSaleDetails.status === 'COMPLETED' ? 'bg-green-200 dark:bg-green-800' : 'bg-amber-200 dark:bg-amber-800'}`}>
                      {selectedSaleDetails.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Clock size={20} />} 
                   </div>
                   <div>
                      <p className="font-bold text-sm">Status</p>
                      <p className="text-xs font-black uppercase tracking-widest">{selectedSaleDetails.status}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-medium opacity-80">Total Amount</p>
                   <p className="text-2xl font-bold tracking-tight">₦{selectedSaleDetails.amount.toLocaleString()}</p>
                </div>
             </div>

             {/* Customer Info */}
             <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between bg-white dark:bg-slate-900">
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                      <User size={20} />
                   </div>
                   <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Customer</p>
                      <p className="font-bold text-slate-900 dark:text-white">{selectedSaleDetails.customer}</p>
                   </div>
                </div>
                <button className="text-xs font-bold text-ubuxa-blue">View Profile</button>
             </div>

             {/* Product Info */}
             <div className="space-y-3">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest pl-2">Purchase Details</p>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3">
                   <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Product</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedSaleDetails.product}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Date</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedSaleDetails.date}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Payment Plan</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedSaleDetails.paymentPlan}</span>
                   </div>
                </div>
             </div>

             {/* Associated Devices */}
             {selectedSaleDetails.devices && selectedSaleDetails.devices.length > 0 && (
               <div className="space-y-3">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest pl-2">Linked Hardware</p>
                  <div className="space-y-2">
                     {selectedSaleDetails.devices.map((sn: string) => (
                        <div key={sn} className="flex items-center space-x-3 p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                           <Smartphone size={16} className="text-slate-400" />
                           <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{sn}</span>
                        </div>
                     ))}
                  </div>
               </div>
             )}
              
             <div className="grid grid-cols-2 gap-3 pt-2">
                <SecondaryButton icon={<FileText size={16} />}>Receipt</SecondaryButton>
                <PrimaryButton>Support</PrimaryButton>
             </div>
          </div>
        )}
      </BottomSheetModal>
    </div>
  );
};

export default Sales;
