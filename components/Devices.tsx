
import React, { useState, useMemo, useEffect } from 'react';
import { Smartphone, Key, History, Search, RefreshCw, SmartphoneIcon, Clock, User, Hash, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { SideDrawer, DataTable } from './Shared';
import { ColumnDef } from '@tanstack/react-table';

const MOCK_DEVICES = [
  { id: '1', sn: 'SP-2024-X91', model: 'Solar Hub Pro v2', status: 'AVAILABLE', tokenable: true },
  { id: '2', sn: 'SP-2024-B12', model: 'Inverter Smart 5k', status: 'USED', tokenable: true },
  { id: '3', sn: 'SP-2023-Z05', model: 'Battery Monitor', status: 'RESERVED', tokenable: false },
  { id: '4', sn: 'SP-2024-K18', model: 'Solar Hub Pro v2', status: 'AVAILABLE', tokenable: true },
  { id: '5', sn: 'SP-2024-L99', model: 'Inverter Smart 5k', status: 'RESERVED', tokenable: true },
  { id: '6', sn: 'SP-2024-M44', model: 'Solar Hub Pro v2', status: 'AVAILABLE', tokenable: true },
  { id: '7', sn: 'SP-2024-N55', model: 'Battery Monitor', status: 'USED', tokenable: false },
];

const MOCK_TOKEN_HISTORY = [
  { id: '1', sn: 'SP-2024-X91', token: '1234-5678-9012', duration: '30 Days', generatedAt: '2024-03-10 10:30', customer: 'Kathleen Pfeffer' },
  { id: '2', sn: 'SP-2024-B12', token: '9876-5432-1098', duration: '7 Days', generatedAt: '2024-03-11 14:15', customer: 'Ericka Considine' },
  { id: '3', sn: 'SP-2024-X91', token: '4567-8901-2345', duration: '30 Days', generatedAt: '2024-02-10 09:00', customer: 'Kathleen Pfeffer' },
  { id: '4', sn: 'SP-2024-K18', token: '1111-2222-3333', duration: 'Unlocking', generatedAt: '2024-03-12 16:45', customer: 'Collins N.' },
  { id: '5', sn: 'SP-2024-B12', token: '5555-6666-7777', duration: '14 Days', generatedAt: '2024-03-05 11:20', customer: 'Ericka Considine' },
];

const MODELS = ['All Models', 'Solar Hub Pro v2', 'Inverter Smart 5k', 'Battery Monitor'];
const STATUSES = ['All', 'Available', 'Used', 'Reserved'];
const ITEMS_PER_PAGE = 4;

interface TokenLog {
  id: string;
  sn: string;
  token: string;
  duration: string;
  generatedAt: string;
  customer: string;
}

const Devices: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('All Models');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedModel, selectedStatus]);

  const filteredDevices = useMemo(() => {
    return MOCK_DEVICES.filter(device => {
      const matchesSearch = 
        device.sn.toLowerCase().includes(searchQuery.toLowerCase()) || 
        device.model.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesModel = 
        selectedModel === 'All Models' || device.model === selectedModel;
      
      const matchesStatus = 
        selectedStatus === 'All' || device.status === selectedStatus.toUpperCase();
      
      return matchesSearch && matchesModel && matchesStatus;
    });
  }, [searchQuery, selectedModel, selectedStatus]);

  const totalPages = Math.ceil(filteredDevices.length / ITEMS_PER_PAGE);
  const paginatedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDevices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDevices, currentPage]);

  const historyColumns = useMemo<ColumnDef<TokenLog>[]>(() => [
    {
      accessorKey: 'sn',
      header: 'Serial Number',
      cell: info => <span className="font-bold text-slate-900">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: info => (
        <div className="flex items-center space-x-2">
          <User size={14} className="text-slate-400" />
          <span>{String(info.getValue())}</span>
        </div>
      ),
    },
    {
      accessorKey: 'token',
      header: 'Generated Token',
      cell: info => (
        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-700">
          {String(info.getValue())}
        </span>
      ),
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: info => {
        const duration = String(info.getValue());
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            duration === 'Unlocking' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-blue-50 text-blue-600'
          }`}>
            {duration}
          </span>
        );
      },
    },
    {
      accessorKey: 'generatedAt',
      header: 'Date',
      cell: info => (
        <div className="flex items-center space-x-2 text-slate-500 text-xs">
          <Clock size={12} />
          <span>{String(info.getValue())}</span>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500 pb-20 lg:pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Device Management</h2>
          <p className="text-slate-500 text-sm">Manage serialized hardware and generate access tokens</p>
        </div>
        <button 
          onClick={() => setIsHistoryDrawerOpen(true)}
          className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-sm hover:bg-slate-50 hover:border-gold transition-all"
        >
          <History size={20} />
          <span>Token History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter/Search */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 lg:sticky lg:top-8">
             <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">Filters</h3>
             <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Serial or Model..." 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-gold focus:outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-gold focus:outline-none transition-all appearance-none cursor-pointer"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {MODELS.map(model => <option key={model} value={model}>{model}</option>)}
                </select>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map(status => (
                      <StatusBadge 
                        key={status} 
                        label={status} 
                        active={selectedStatus === status} 
                        onClick={() => setSelectedStatus(status)}
                      />
                    ))}
                  </div>
                </div>
                {(searchQuery || selectedModel !== 'All Models' || selectedStatus !== 'All') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedModel('All Models');
                      setSelectedStatus('All');
                    }}
                    className="w-full text-xs font-bold text-red-500 hover:underline text-center pt-2"
                  >
                    Reset All Filters
                  </button>
                )}
             </div>
          </div>
        </div>

        {/* Device List */}
        <div className="lg:col-span-3 space-y-4">
          {paginatedDevices.length > 0 ? (
            <>
              {paginatedDevices.map((device) => (
                <div key={device.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-gold hover:shadow-lg transition-all group">
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-gold transition-colors">
                       <SmartphoneIcon size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{device.sn}</h4>
                      <p className="text-sm text-slate-500">{device.model}</p>
                      <div className="flex items-center space-x-2 mt-2">
                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                           device.status === 'AVAILABLE' ? 'bg-green-50 text-green-600' : 
                           device.status === 'USED' ? 'bg-slate-100 text-slate-500' : 'bg-orange-50 text-orange-600'
                         }`}>
                           {device.status}
                         </span>
                         {device.tokenable && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/10 text-gold border border-gold/20">
                              PAYGO ENABLED
                            </span>
                         )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                     <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors">
                       Details
                     </button>
                     {device.tokenable && (
                        <button className="flex-1 sm:flex-none px-6 py-3 bg-gold-gradient text-slate-900 rounded-2xl font-bold text-sm shadow-md hover:scale-105 transition-transform flex items-center justify-center space-x-2">
                          <Key size={16} />
                          <span>Gen Token</span>
                        </button>
                     )}
                  </div>
                </div>
              ))}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-8 py-6 bg-white rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <ChevronLeftIcon size={18} />
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <ChevronRightIcon size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <SmartphoneIcon size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-900">No devices found</h4>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Try adjusting your filters or search query to find the hardware you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      {/* TOKEN HISTORY DRAWER */}
      <SideDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        title="Token Logs"
        subtitle="Historical records of all access tokens generated for your assigned hardware."
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gold shadow-sm">
              <History size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Audit Trail</h4>
              <p className="text-xs text-slate-500">Track device activation and payment-linked tokens.</p>
            </div>
          </div>

          <DataTable 
            data={MOCK_TOKEN_HISTORY} 
            columns={historyColumns} 
            searchPlaceholder="Search by SN or Customer..."
          />
        </div>
      </SideDrawer>
    </div>
  );
};

const StatusBadge: React.FC<{ label: string, active?: boolean, onClick?: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
      active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-gold'
    }`}
  >
    {label}
  </button>
);

export default Devices;
