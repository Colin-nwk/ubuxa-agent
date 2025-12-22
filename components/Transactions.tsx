
import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Search, Filter, Download } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', type: 'PAYMENT', amount: 45000, date: 'Oct 24, 2023', status: 'SUCCESS', desc: 'Payment from Alice Johnson' },
  { id: 'TXN-002', type: 'COMMISSION', amount: 2500, date: 'Oct 23, 2023', status: 'PENDING', desc: 'Commission for Sale #123' },
  { id: 'TXN-003', type: 'REVERSAL', amount: 5000, date: 'Oct 20, 2023', status: 'FAILED', desc: 'Refund for Bob Smith' },
];

const Transactions: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
         <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 shadow-sm"><Download size={20} /></button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-2 group focus-within:border-primary transition-colors">
         <Search className="text-slate-400 ml-2 group-focus-within:text-primary" size={20} />
         <input type="text" placeholder="Search transactions..." className="flex-1 py-2 outline-none text-sm text-slate-900 dark:text-white bg-transparent placeholder:text-slate-400" />
      </div>

      <div className="space-y-4">
         {MOCK_TRANSACTIONS.map(txn => (
            <div key={txn.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-primary dark:hover:border-primary transition-colors">
               <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                     txn.type === 'PAYMENT' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                     txn.type === 'COMMISSION' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                     {txn.type === 'PAYMENT' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                     <p className="font-bold text-slate-900 dark:text-white text-sm">{txn.desc}</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">{txn.date} • {txn.id}</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className={`font-bold ${txn.type === 'REVERSAL' ? 'text-slate-900 dark:text-white' : 'text-primary'}`}>
                     {txn.type === 'REVERSAL' ? '-' : '+'}₦{txn.amount.toLocaleString()}
                  </p>
                  <span className={`text-[10px] font-bold uppercase ${
                     txn.status === 'SUCCESS' ? 'text-green-600 dark:text-green-400' : 
                     txn.status === 'PENDING' ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
                  }`}>{txn.status}</span>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default Transactions;
