
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Phone, 
  MapPin, 
  MoreHorizontal, 
  Eye, 
  Mail,
  Calendar,
  History,
  ShieldAlert,
  Edit,
  UserCheck
} from 'lucide-react';
import { SideDrawer, PrimaryButton, SecondaryButton, Input } from './Shared';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Kathleen Pfeffer', email: 'angela98@gmail.com', phone: '+234 801 234 5678', location: 'Manteside, Lagos', status: 'ACTIVE' },
  { id: '2', name: 'Ericka Considine', email: 'carlo34@yahoo.com', phone: '+234 702 345 6789', location: 'South Elisa, Abuja', status: 'ACTIVE' },
  { id: '3', name: 'Edmond Schulist', email: 'jude_armstrong@hotmail.com', phone: '+234 903 456 7890', location: 'West Valley, Ibadan', status: 'ACTIVE' },
  { id: '4', name: 'Brionna O\'Keefe', email: 'elnora@hotmail.com', phone: '+234 814 567 8901', location: 'Lake Kiera, Kano', status: 'BARRED' },
];

const MOCK_HISTORY = [
  { id: 'H1', action: 'Purchase: Solar Hub Pro v2', date: 'Oct 12, 2024', type: 'SALE' },
  { id: 'H2', action: 'Status Changed: Activated', date: 'Sept 28, 2024', type: 'SYSTEM' },
  { id: 'H3', action: 'Payment Received: ₦45,000', date: 'Aug 15, 2024', type: 'PAYMENT' },
];

const Customers: React.FC = () => {
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time filtering logic
  const filteredCustomers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return MOCK_CUSTOMERS;
    
    return MOCK_CUSTOMERS.filter(customer => 
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.location.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Customers</h2>
          <p className="text-slate-500 text-sm">Manage and register new clients</p>
        </div>
        <PrimaryButton 
          onClick={() => setIsAddDrawerOpen(true)}
          className="flex items-center space-x-2"
        >
          <UserPlus size={20} />
          <span>New Customer</span>
        </PrimaryButton>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email or location..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 hover:border-gold transition-colors">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => setSelectedCustomer(customer)}
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={`https://picsum.photos/seed/${customer.id}/40/40`} className="w-10 h-10 rounded-full border border-slate-100" alt="" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide md:hidden">{customer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 hidden md:table-cell">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 hidden lg:table-cell">{customer.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        customer.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <p className="text-lg font-medium">No customers found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER: Add New Customer */}
      <SideDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="New Registration"
        subtitle="Complete the onboarding form to create a new customer record."
        footer={
          <PrimaryButton className="w-full py-4 text-lg">
            Create Profile
          </PrimaryButton>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="e.g. John" />
            <Input label="Last Name" placeholder="e.g. Doe" />
          </div>
          <Input label="Email Address" type="email" placeholder="john.doe@example.com" icon={<Mail size={18} />} />
          <Input label="Phone Number" type="tel" placeholder="+234 ..." icon={<Phone size={18} />} />
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Residential Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-gold focus:outline-none min-h-[120px] resize-none transition-all" 
                placeholder="Enter full address details..."
              />
            </div>
          </div>
        </div>
      </SideDrawer>

      {/* DRAWER: Customer Details */}
      <SideDrawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title="Customer Profile"
        subtitle="Full diagnostic view and interaction history."
        footer={
          <div className="flex space-x-4">
            <SecondaryButton className="flex-1 flex items-center justify-center space-x-2">
              <Edit size={16} />
              <span>Edit</span>
            </SecondaryButton>
            <button className={`flex-1 py-3 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 ${
              selectedCustomer?.status === 'ACTIVE' 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}>
              {selectedCustomer?.status === 'ACTIVE' ? <ShieldAlert size={16} /> : <UserCheck size={16} />}
              <span>{selectedCustomer?.status === 'ACTIVE' ? 'Bar Client' : 'Activate'}</span>
            </button>
          </div>
        }
      >
        {selectedCustomer && (
          <div className="space-y-8">
            {/* Identity Card */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex items-center space-x-5 shadow-xl shadow-slate-200">
              <img 
                src={`https://picsum.photos/seed/${selectedCustomer.id}/80/80`} 
                className="w-20 h-20 rounded-3xl border-2 border-gold object-cover" 
                alt={selectedCustomer.name} 
              />
              <div>
                <h4 className="text-xl font-serif font-bold leading-tight">{selectedCustomer.name}</h4>
                <p className="text-slate-400 text-xs font-medium mt-1">ID: CUST-000{selectedCustomer.id}</p>
                <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  selectedCustomer.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedCustomer.status}
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Contact Information</h5>
              <div className="grid grid-cols-1 gap-3">
                <DetailRow icon={<Phone size={16} className="text-gold" />} label="Phone" value={selectedCustomer.phone} />
                <DetailRow icon={<Mail size={16} className="text-gold" />} label="Email" value={selectedCustomer.email} />
                <DetailRow icon={<MapPin size={16} className="text-gold" />} label="Address" value={selectedCustomer.location} />
              </div>
            </div>

            {/* Transaction History / Notes Placeholder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pl-1">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h5>
                <button className="text-blue-600 text-[10px] font-bold hover:underline">View All History</button>
              </div>
              <div className="space-y-3">
                {MOCK_HISTORY.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-gold transition-colors">
                    <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-gold transition-colors">
                      <History size={16} className="text-slate-400 group-hover:text-slate-900" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.action}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-[10px] font-medium text-slate-500">{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Insights */}
            <div className="p-6 bg-gold-gradient rounded-[2rem] text-slate-900 shadow-lg shadow-gold/20">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Total LTV</p>
                   <h3 className="text-2xl font-serif font-bold">₦840,000</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Active Devices</p>
                   <h3 className="text-2xl font-serif font-bold">02</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </SideDrawer>
    </div>
  );
};

const DetailRow: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
    <div className="p-2 bg-slate-50 rounded-xl mr-4">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
    </div>
  </div>
);

export default Customers;
