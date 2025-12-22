
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  Smartphone, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Plus,
  Bell,
  Search,
  LogOut,
  Layers,
  TableProperties,
  Box,
  WifiOff
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Devices from './components/Devices';
import Reports from './components/Reports';
import SettingsView from './components/SettingsView';
import ComponentGallery from './components/ComponentGallery';
import Login from './components/Login';
import Packages from './components/Packages';

// New Table Views
import CustomersList from './components/CustomersList';
import SalesList from './components/SalesList';
import InventoryList from './components/InventoryList';
import DevicesList from './components/DevicesList';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const auth = localStorage.getItem('agent_auth');
    if (auth) setIsLoggedIn(true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex font-sans">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white fixed h-full border-r border-slate-800 shadow-2xl">
          <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
            <div className="w-10 h-10 bg-ubuxa-gradient rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">U</div>
            <span className="text-2xl font-bold tracking-tight text-white uppercase italic">UBUXA</span>
          </div>
          
          <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem to="/sales" icon={<ShoppingCart size={18} />} label="Sales" />
            <NavItem to="/customers" icon={<Users size={18} />} label="Customers" />
            <NavItem to="/inventory" icon={<Package size={18} />} label="Inventory" />
            <NavItem to="/packages" icon={<Box size={18} />} label="Packages" />
            <NavItem to="/devices" icon={<Smartphone size={18} />} label="Devices" />
            <NavItem to="/reports" icon={<BarChart3 size={18} />} label="Reports" />
            
            <div className="pt-8 pb-3">
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Advanced Audit</p>
            </div>
            <NavItem to="/sales-list" icon={<TableProperties size={18} />} label="Sales Logs" />
            <NavItem to="/customers-list" icon={<TableProperties size={18} />} label="Customer Registry" />
            <NavItem to="/inventory-list" icon={<TableProperties size={18} />} label="Stock List" />
            <NavItem to="/devices-list" icon={<TableProperties size={18} />} label="Hardware Index" />

            <div className="pt-8 pb-3 border-t border-slate-800/50 mt-6">
              <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
              <NavItem to="/ui-library" icon={<Layers size={18} />} label="UI Gallery" />
            </div>
          </nav>

          <div className="p-6 border-t border-slate-800">
            <button 
              onClick={() => { localStorage.removeItem('agent_auth'); setIsLoggedIn(false); }}
              className="flex items-center space-x-3 text-slate-400 hover:text-red-400 transition-colors w-full px-4 py-3 rounded-xl hover:bg-slate-800"
            >
              <LogOut size={20} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navbar */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-ubuxa-gradient rounded-lg flex items-center justify-center font-bold text-white shadow-md">U</div>
             <span className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">UBUXA</span>
             {!isOnline && (
               <div className="bg-red-50 text-red-600 px-2 py-0.5 rounded-lg flex items-center space-x-1 animate-pulse-red">
                 <WifiOff size={14} />
                 <span className="text-[10px] font-bold uppercase">Offline</span>
               </div>
             )}
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-slate-900 p-6 flex flex-col overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-bold text-white uppercase italic">Menu</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={28} />
                </button>
              </div>
              <nav className="space-y-4 flex-1">
                <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/sales" icon={<ShoppingCart size={20} />} label="Sales" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/customers" icon={<Users size={20} />} label="Customers" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/inventory" icon={<Package size={20} />} label="Inventory" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/packages" icon={<Box size={20} />} label="Packages" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/devices" icon={<Smartphone size={20} />} label="Devices" onClick={() => setIsSidebarOpen(false)} />
                <div className="h-px bg-slate-800 my-4"></div>
                <NavItem to="/sales-list" icon={<TableProperties size={20} />} label="Sales Logs" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/customers-list" icon={<TableProperties size={20} />} label="Customer Registry" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/inventory-list" icon={<TableProperties size={20} />} label="Stock List" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/devices-list" icon={<TableProperties size={20} />} label="Hardware Index" onClick={() => setIsSidebarOpen(false)} />
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
          <div className="max-w-7xl mx-auto p-4 lg:p-10">
            <header className="hidden lg:flex justify-between items-center mb-10">
               <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Portal</h1>
                    {!isOnline && (
                      <div className="bg-red-50 text-red-600 px-4 py-1.5 rounded-2xl flex items-center space-x-2 animate-pulse-red border border-red-100 shadow-sm">
                        <WifiOff size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Working Offline</span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-500 font-medium text-sm mt-1">Welcome back, Agent Collins Nwoko</p>
               </div>
               <div className="flex items-center space-x-8">
                  <div className="relative group">
                    <input type="text" placeholder="Global search..." className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 shadow-sm group-hover:border-blue-400 transition-all" />
                    <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500" size={20} />
                  </div>
                  <button className="relative p-3 text-slate-600 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-blue-500 transition-all shadow-sm">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="flex items-center space-x-4 pl-8 border-l border-slate-200">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 leading-none">Collins Nwoko</p>
                      <p className="text-xs text-slate-500 mt-1.5 font-semibold">Lagos Hub Manager</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl border-2 border-ubuxa-blue p-0.5 shadow-lg shadow-blue-500/10 transition-transform hover:scale-105 cursor-pointer">
                      <img src="https://picsum.photos/40/40" alt="Avatar" className="w-full h-full rounded-[0.8rem] object-cover" />
                    </div>
                  </div>
               </div>
            </header>

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/ui-library" element={<ComponentGallery />} />
              
              {/* New Table Views */}
              <Route path="/customers-list" element={<CustomersList />} />
              <Route path="/sales-list" element={<SalesList />} />
              <Route path="/inventory-list" element={<InventoryList />} />
              <Route path="/devices-list" element={<DevicesList />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        {/* Mobile Bottom Navigation (Persistent CTA) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-40 px-2 shadow-2xl">
            <BottomNavItem to="/" icon={<LayoutDashboard size={24} />} />
            <BottomNavItem to="/sales" icon={<ShoppingCart size={24} />} />
            <button className="bg-ubuxa-gradient text-white p-4 rounded-2xl shadow-xl -mt-10 border-4 border-slate-50 transition-transform active:scale-90">
                <Plus size={28} strokeWidth={3} />
            </button>
            <BottomNavItem to="/customers" icon={<Users size={24} />} />
            <BottomNavItem to="/inventory" icon={<Package size={24} />} />
        </nav>
      </div>
    </Router>
  );
};

const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string, onClick?: () => void }> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
        isActive 
        ? 'bg-ubuxa-gradient text-white font-bold shadow-lg shadow-blue-600/20' 
        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
      }`}
    >
      <div className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>{icon}</div>
      <span className="text-[15px]">{label}</span>
    </Link>
  );
};

const BottomNavItem: React.FC<{ to: string, icon: React.ReactNode }> = ({ to, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`p-4 transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
      {icon}
    </Link>
  );
};

export default App;
