
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
  Box
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

  useEffect(() => {
    const auth = localStorage.getItem('agent_auth');
    if (auth) setIsLoggedIn(true);
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white fixed h-full border-r border-slate-800">
          <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
            <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center font-bold text-slate-900">U</div>
            <span className="text-xl font-serif font-bold tracking-tight">UBUXA</span>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem to="/sales" icon={<ShoppingCart size={18} />} label="Sales" />
            <NavItem to="/customers" icon={<Users size={18} />} label="Customers" />
            <NavItem to="/inventory" icon={<Package size={18} />} label="Inventory" />
            <NavItem to="/packages" icon={<Box size={18} />} label="Packages" />
            <NavItem to="/devices" icon={<Smartphone size={18} />} label="Devices" />
            <NavItem to="/reports" icon={<BarChart3 size={18} />} label="Reports" />
            
            <div className="pt-6 pb-2">
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Advanced Views</p>
            </div>
            <NavItem to="/sales-list" icon={<TableProperties size={18} />} label="Sales Logs" />
            <NavItem to="/customers-list" icon={<TableProperties size={18} />} label="Customer Registry" />
            <NavItem to="/inventory-list" icon={<TableProperties size={18} />} label="Stock List" />
            <NavItem to="/devices-list" icon={<TableProperties size={18} />} label="Hardware Index" />

            <div className="pt-6 pb-2 border-t border-slate-800/50 mt-4">
              <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
              <NavItem to="/ui-library" icon={<Layers size={18} />} label="UI Gallery" />
            </div>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={() => { localStorage.removeItem('agent_auth'); setIsLoggedIn(false); }}
              className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-3"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navbar */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center font-bold text-slate-900">U</div>
             <span className="text-lg font-serif font-bold text-slate-900">UBUXA</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-64 bg-slate-900 p-6 flex flex-col overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-serif font-bold text-white">Menu</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-white">
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-4 flex-1">
                <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/sales" icon={<ShoppingCart size={20} />} label="Sales" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/customers" icon={<Users size={20} />} label="Customers" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/inventory" icon={<Package size={20} />} label="Inventory" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/packages" icon={<Box size={20} />} label="Packages" onClick={() => setIsSidebarOpen(false)} />
                <NavItem to="/devices" icon={<Smartphone size={20} />} label="Devices" onClick={() => setIsSidebarOpen(false)} />
                <div className="h-px bg-slate-800 my-2"></div>
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
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <header className="hidden lg:flex justify-between items-center mb-8">
               <div className="flex flex-col">
                  <h1 className="text-2xl font-serif font-bold text-slate-900">Portal</h1>
                  <p className="text-slate-500 text-sm">Welcome back, Agent Collins</p>
               </div>
               <div className="flex items-center space-x-6">
                  <div className="relative">
                    <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  </div>
                  <button className="relative p-2 text-slate-600 bg-white rounded-full border border-slate-200 hover:bg-slate-50">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 leading-none">Collins Nwoko</p>
                      <p className="text-xs text-slate-500 mt-1">Senior Agent</p>
                    </div>
                    <img src="https://picsum.photos/40/40" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-gold" />
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
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-40 px-2">
            <BottomNavItem to="/" icon={<LayoutDashboard size={22} />} />
            <BottomNavItem to="/sales" icon={<ShoppingCart size={22} />} />
            <button className="bg-gold-gradient text-slate-900 p-3 rounded-full shadow-lg -mt-8 border-4 border-slate-50">
                <Plus size={24} strokeWidth={3} />
            </button>
            <BottomNavItem to="/customers" icon={<Users size={22} />} />
            <BottomNavItem to="/inventory" icon={<Package size={22} />} />
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
      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
        isActive 
        ? 'bg-gold-gradient text-slate-900 font-bold shadow-md' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
};

const BottomNavItem: React.FC<{ to: string, icon: React.ReactNode }> = ({ to, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`p-3 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
      {icon}
    </Link>
  );
};

export default App;
