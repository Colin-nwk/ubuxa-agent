
import React, { useMemo } from 'react';
import { DataTable, DropdownMenu } from './Shared';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, FileText, Trash2, ShoppingCart, Calendar, DollarSign } from 'lucide-react';

const MOCK_SALES = [
  { id: 'SL-2024-001', customer: 'Kathleen Pfeffer', product: 'Starter Home Bundle', amount: 450000, status: 'COMPLETED', date: '2024-10-12', payment: 'MOMO' },
  { id: 'SL-2024-002', customer: 'Ericka Considine', product: 'Solar Hub Pro v2', amount: 85000, status: 'PENDING', date: '2024-10-11', payment: 'BANK' },
  { id: 'SL-2024-003', customer: 'Edmond Schulist', product: 'Luminous 220Ah Battery', amount: 280000, status: 'COMPLETED', date: '2024-10-10', payment: 'CASH' },
  { id: 'SL-2024-004', customer: 'John Smith', product: 'Canadian Solar 450W', amount: 120000, status: 'COMPLETED', date: '2024-10-09', payment: 'MOMO' },
  { id: 'SL-2024-005', customer: 'Jane Doe', product: 'Elite Power System', amount: 980000, status: 'PENDING', date: '2024-10-08', payment: 'BANK' },
];

const SalesList: React.FC = () => {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => <span className="font-mono text-[11px] font-bold text-slate-500">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'customer',
      header: 'Client Name',
      cell: info => <span className="font-bold text-slate-900">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'product',
      header: 'Items Purchased',
      cell: info => <span className="text-slate-600 truncate max-w-[180px] inline-block">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Revenue',
      cell: info => <span className="font-bold text-gold">₦{Number(info.getValue()).toLocaleString()}</span>,
    },
    {
      accessorKey: 'payment',
      header: 'Method',
      cell: info => <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = String(info.getValue());
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 
            status === 'PENDING' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
          }`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date Created',
      cell: info => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{String(info.getValue())}</span>,
    },
    {
      id: 'actions',
      header: 'Options',
      cell: () => (
        <DropdownMenu 
          trigger={<button className="p-2 hover:bg-slate-100 rounded-lg font-bold text-xs bg-white border border-slate-200">Review</button>}
          items={[
            { label: 'Full Audit', icon: <Eye size={14} />, onClick: () => {} },
            { label: 'Download Receipt', icon: <FileText size={14} />, onClick: () => {} },
            { label: 'Void Transaction', icon: <Trash2 size={14} />, onClick: () => {}, variant: 'danger' },
          ]}
        />
      ),
    }
  ], []);

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Sales Transaction Logs</h2>
          <p className="text-slate-500 text-sm">Detailed historical view of all recorded deals.</p>
        </div>
      </div>

      <DataTable 
        data={MOCK_SALES} 
        columns={columns} 
        searchPlaceholder="Filter transactions..."
      />
    </div>
  );
};

export default SalesList;
