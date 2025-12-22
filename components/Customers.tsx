
import React, { useState } from 'react';
import { Search, UserPlus, Phone, MapPin, MoreVertical, CreditCard } from 'lucide-react';
import { PrimaryButton, SideDrawer, StatCard } from './Shared';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Kathleen Pfeffer', email: 'angela98@gmail.com', phone: '+234 801 234 5678', location: 'Lekki, Lagos', status: 'ACTIVE', balance: 0 },
  { id: '2', name: 'Ericka Considine', email: 'carlo34@yahoo.com', phone: '+234 702 345 6789', location: 'Abuja', status: 'DEFAULTING', balance: 45000 },
];

const Customers: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers</h1>
         <PrimaryButton icon={<UserPlus size={18} />}>Add New</PrimaryButton>
      </div>

      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-2 group focus-within:border-primary transition-colors">
         <Search className="text-slate-400 ml-2 group-focus-within:text-primary" size={20} />
         <input type="text" placeholder="Search name or phone..." className="flex-1 py-2 outline-none text-sm text-slate-900 dark:text-white bg-transparent placeholder:text-slate-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {MOCK_CUSTOMERS.map(customer => (
            <div 
               key={customer.id} 
               onClick={() => setSelectedCustomer(customer)}
               className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary dark:hover:border-primary transition-colors cursor-pointer active:scale-[0.98]"
            >
               <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg">
                     {customer.name.charAt(0)}
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                     customer.status === 'ACTIVE' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                     {customer.status}
                  </span>
               </div>
               <h3 className="font-bold text-slate-900 dark:text-white text-lg">{customer.name}</h3>
               <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <Phone size={14} className="mr-1" />
                  <span>{customer.phone}</span>
               </div>
               <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span>{customer.location}</span>
               </div>
            </div>
         ))}
      </div>

      <SideDrawer
         isOpen={!!selectedCustomer}
         onClose={() => setSelectedCustomer(null)}
         title="Customer Profile"
         footer={
            <div className="flex space-x-3 w-full">
               <button className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Message</button>
               <button className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity">New Sale</button>
            </div>
         }
      >
         {selectedCustomer && (
            <div className="space-y-6">
               <div className="text-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-2xl mx-auto mb-3">
                     {selectedCustomer.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCustomer.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{selectedCustomer.phone}</p>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                     <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Balance</p>
                     <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">₦{selectedCustomer.balance.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                     <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Status</p>
                     <p className={`text-lg font-bold mt-1 ${selectedCustomer.status === 'ACTIVE' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{selectedCustomer.status}</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white">Active Products</h4>
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between bg-white dark:bg-slate-900">
                     <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Solar Home System</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Installed Oct 2023</p>
                     </div>
                     <span className="text-xs font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Active</span>
                  </div>
               </div>
            </div>
         )}
      </SideDrawer>
    </div>
  );
};

export default Customers;
