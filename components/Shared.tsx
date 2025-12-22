
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownRight, 
  Check, 
  Upload, 
  MapPin, 
  Search, 
  FileText, 
  Trash2,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';

// --- DATA TABLE (TANSTACK) ---
interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchPlaceholder?: string;
}

export function DataTable<TData>({ data, columns, searchPlaceholder = "Search records..." }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={18} />
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 focus:ring-2 focus:ring-ubuxa-blue focus:outline-none transition-all shadow-sm group-hover:border-blue-300"
            placeholder={searchPlaceholder}
          />
        </div>
        <div className="flex items-center justify-between sm:justify-end space-x-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm shrink-0">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-ubuxa-blue"
          >
            {[5, 10, 20, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-900 text-white">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 sm:px-8 py-4 sm:py-6 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em]">
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center space-x-2 ${header.column.getCanSort() ? 'cursor-pointer select-none group' : ''}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="group-hover:text-blue-400 transition-colors">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {header.column.getCanSort() && (
                            <ArrowUpDown size={14} className={`transition-opacity ${header.column.getIsSorted() ? 'opacity-100 text-blue-400' : 'opacity-20 group-hover:opacity-100'}`} />
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors group active:bg-blue-50/50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-slate-700 font-medium whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-8 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                       <Search size={40} className="text-slate-200 mb-4" />
                       <p className="text-base font-bold text-slate-900">No matching records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 sm:px-8 py-4 sm:py-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Page</span>
            <span className="text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200">{table.getState().pagination.pageIndex + 1}</span>
            <span>of</span>
            <span className="text-slate-900">{table.getPageCount()}</span>
            <span className="hidden sm:inline ml-4 opacity-50">•</span>
            <span className="hidden sm:inline ml-4">{table.getFilteredRowModel().rows.length} entries</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <PaginationButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <ChevronsLeft size={16} />
            </PaginationButton>
            <PaginationButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft size={16} />
            </PaginationButton>
            <PaginationButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight size={16} />
            </PaginationButton>
            <PaginationButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <ChevronsRight size={16} />
            </PaginationButton>
          </div>
        </div>
      </div>
    </div>
  );
}

const PaginationButton: React.FC<{ children: React.ReactNode, onClick: () => void, disabled?: boolean }> = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-ubuxa-blue hover:text-white active:scale-90 disabled:opacity-20 transition-all shadow-sm"
  >
    {children}
  </button>
);

// --- MODAL ---
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalType = 'default' | 'success' | 'danger' | 'warning' | 'info';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  type?: ModalType;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  footer, 
  size = 'md',
  type = 'default' 
}) => {
  // Lock body scroll when modal is open to prevent double scrollbars
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]'
  };

  const typeHeaderColors = {
    default: 'bg-slate-900',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-orange-500',
    info: 'bg-ubuxa-blue'
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 max-h-[90vh]`}>
        <div className={`${typeHeaderColors[type]} p-6 sm:p-10 text-white shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-8">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight truncate">{title}</h3>
              {subtitle && <p className="text-white/70 text-xs sm:text-sm mt-1 sm:mt-2 font-medium line-clamp-2">{subtitle}</p>}
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 text-slate-600 no-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="p-6 sm:p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- DRAWER ---
interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  footer,
  maxWidth = 'max-w-lg'
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div className={`absolute top-0 right-0 h-full w-full ${maxWidth} bg-white shadow-2xl transition-transform duration-500 transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-slate-900 text-white p-6 sm:p-10 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase italic">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} sm={28} />
            </button>
          </div>
          {subtitle && <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">{subtitle}</p>}
        </div>
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 no-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="p-6 sm:p-10 border-t border-slate-100 bg-slate-50 shadow-inner flex flex-col sm:flex-row gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- BUTTONS ---
export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }> = ({ children, className, icon, ...props }) => (
  <button 
    className={`bg-ubuxa-gradient text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold shadow-xl shadow-ubuxa-blue/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base ${className}`}
    {...props}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <span>{children}</span>
  </button>
);

export const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }> = ({ children, className, icon, ...props }) => (
  <button 
    className={`bg-slate-900 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-slate-800 shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base ${className}`}
    {...props}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <span>{children}</span>
  </button>
);

// --- TABS ---
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export const Tabs: React.FC<{ tabs: TabItem[], activeTab: string, onChange: (id: string) => void }> = ({ tabs, activeTab, onChange }) => (
  <div className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
          activeTab === tab.id 
          ? 'bg-white text-ubuxa-blue shadow-sm border border-slate-100' 
          : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {tab.icon && <span className={activeTab === tab.id ? 'text-ubuxa-blue' : ''}>{tab.icon}</span>}
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);

// --- FORMS ---
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: React.ReactNode }> = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
    <div className="relative group">
      {icon && <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors">{icon}</div>}
      <input
        {...props}
        className={`w-full ${icon ? 'pl-11 sm:pl-14' : 'px-5 sm:px-6'} pr-5 sm:px-6 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-[1.25rem] text-sm sm:text-base text-slate-900 font-bold focus:ring-2 focus:ring-ubuxa-blue focus:outline-none transition-all shadow-sm group-hover:border-blue-300 ${props.className}`}
      />
    </div>
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
    <div className="relative group">
      <select
        {...props}
        className={`w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-[1.25rem] text-sm sm:text-base text-slate-900 font-bold focus:ring-2 focus:ring-ubuxa-blue focus:outline-none appearance-none transition-all cursor-pointer shadow-sm group-hover:border-blue-300 ${props.className}`}
      >
        {children}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-ubuxa-blue transition-colors">
        <ChevronDown size={18} />
      </div>
    </div>
  </div>
);

export const Checkbox: React.FC<{ label: string, checked?: boolean, onChange?: (val: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${checked ? 'bg-ubuxa-blue border-ubuxa-blue shadow-md' : 'bg-white border-slate-200 group-hover:border-blue-400'}`}>
      {checked && <Check size={14} className="text-white" strokeWidth={4} />}
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
    </div>
    <span className="text-sm font-bold text-slate-700 select-none truncate">{label}</span>
  </label>
);

export const Switch: React.FC<{ label: string, enabled?: boolean, onChange?: (val: boolean) => void }> = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between py-1 gap-4">
    <span className="text-sm font-bold text-slate-700 truncate">{label}</span>
    <button 
      type="button"
      onClick={() => onChange?.(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${enabled ? 'bg-ubuxa-gradient shadow-sm' : 'bg-slate-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

export const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend?: string, positive?: boolean }> = ({ title, value, icon, trend, positive }) => (
  <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-ubuxa-blue hover:shadow-lg transition-all active:scale-[0.98]">
    <div className="flex justify-between items-start mb-4 sm:mb-6">
      <div className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl group-hover:bg-ubuxa-gradient group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
        {icon}
      </div>
      <button className="text-slate-300 hover:text-slate-600 transition-colors">
        <MoreVertical size={18} />
      </button>
    </div>
    <div className="min-w-0">
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest truncate">{title}</p>
      <div className="flex items-baseline space-x-2 mt-1.5 flex-wrap">
        <h3 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight italic truncate">{value}</h3>
        {trend && (
          <span className={`text-[10px] font-black flex items-center px-1.5 py-0.5 rounded-lg shrink-0 ${positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {positive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

export const MultiSelect: React.FC<{ label: string, options: string[], selected: string[], onChange: (vals: string[]) => void }> = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else onChange([...selected, opt]);
  };

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[50px] sm:min-h-[58px] px-4 sm:px-5 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-[1.25rem] flex flex-wrap gap-2 items-center cursor-pointer hover:border-ubuxa-blue transition-all shadow-sm"
      >
        {selected.length === 0 ? (
          <span className="text-slate-400 text-sm font-medium">Choose items...</span>
        ) : (
          selected.map(s => (
            <span key={s} className="bg-ubuxa-blue text-white px-2.5 py-1 rounded-lg text-[9px] font-bold flex items-center space-x-1.5 animate-in zoom-in-95">
              <span>{s}</span>
              <X size={12} className="cursor-pointer hover:bg-white/20 rounded shrink-0" onClick={(e) => { e.stopPropagation(); toggleOption(s); }} />
            </span>
          ))
        )}
        <div className="ml-auto text-slate-400 shrink-0">
          <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 no-scrollbar">
          {options.map(opt => (
            <div 
              key={opt}
              onClick={() => toggleOption(opt)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-all"
            >
              <span className={`text-sm font-bold ${selected.includes(opt) ? 'text-ubuxa-blue' : 'text-slate-500'}`}>{opt}</span>
              {selected.includes(opt) && <Check size={16} className="text-ubuxa-blue" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Accordion: React.FC<{ title: string, children: React.ReactNode, isOpen?: boolean, onToggle?: () => void }> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:border-ubuxa-blue/30">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors"
      >
        <span className="font-bold text-slate-900 text-sm tracking-tight">{title}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-500 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[800px] border-t border-slate-50' : 'max-h-0'}`}>
        <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/40">
          {children}
        </div>
      </div>
    </div>
  );
};

export const FileUpload: React.FC<{ label: string, description?: string, accept?: string, onChange?: (file: File | null) => void }> = ({ label, description, accept, onChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (onChange) onChange(selected);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
      <div 
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[2rem] p-6 sm:p-10 text-center transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] shadow-sm ${
          file ? 'border-ubuxa-blue bg-blue-50/30' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-ubuxa-blue hover:shadow-lg'
        }`}
      >
        <input type="file" ref={inputRef} className="hidden" accept={accept} onChange={handleFileChange} />
        {file ? (
          <div className="flex flex-col items-center space-y-2 w-full px-4">
            <CheckCircle2 className="text-ubuxa-blue mb-2 shrink-0" size={32} />
            <p className="text-sm font-bold text-slate-900 truncate max-w-full">{file.name}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <>
            <Upload size={28} className="text-slate-400 mb-3 group-hover:text-ubuxa-blue transition-colors shrink-0" />
            <p className="text-base font-bold text-slate-900">Drop files or tap</p>
            {description && <p className="text-xs text-slate-500 mt-1 font-medium px-4">{description}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export const GoogleMapPlaceholder: React.FC<{ address?: string }> = ({ address }) => (
  <div className="relative w-full h-[280px] sm:h-[350px] bg-slate-100 rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-slate-200 shadow-inner">
    <div className="absolute inset-0 opacity-20" style={{ 
      backgroundImage: 'radial-gradient(#0077C2 1px, transparent 1px)', 
      backgroundSize: '30px 30px' 
    }}></div>
    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center space-x-2 sm:space-x-3 z-10">
      <div className="flex-1 bg-white/95 backdrop-blur shadow-2xl rounded-2xl px-4 sm:px-6 py-2 sm:py-3 border border-slate-100 flex items-center min-w-0">
        <Search size={16} className="text-slate-400 mr-2 sm:mr-3 shrink-0" />
        <span className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">{address || 'Loading map interface...'}</span>
      </div>
      <button className="bg-slate-900 text-white p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-xl hover:bg-ubuxa-blue transition-colors shrink-0">
        <MapPin size={18} />
      </button>
    </div>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
       <div className="relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-[9px] sm:text-[11px] font-black uppercase tracking-widest shadow-2xl whitespace-nowrap">
             Point Alpha
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-ubuxa-gradient rounded-full shadow-2xl flex items-center justify-center border-4 border-white animate-pulse">
             <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
          </div>
       </div>
    </div>
  </div>
);

// --- DROPDOWN MENU ---
interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export const DropdownMenu: React.FC<{ trigger: React.ReactNode, items: MenuItem[] }> = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute z-50 right-0 mt-2 w-48 sm:w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in slide-in-from-top-2 zoom-in-95 origin-top-right">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.onClick(); setIsOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left group active:bg-slate-50 ${
                item.variant === 'danger' ? 'text-red-500 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-50 hover:text-ubuxa-blue'
              }`}
            >
              {item.icon && <span className="opacity-70 group-hover:scale-110 transition-transform shrink-0">{item.icon}</span>}
              <span className="text-xs sm:text-sm font-bold truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- NOTIFICATION (TOAST) ---
export const Toast: React.FC<{ title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error', onClose: () => void }> = ({ title, message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    info: <Info className="text-ubuxa-blue" />,
    success: <Check className="text-green-500" />,
    warning: <AlertTriangle className="text-orange-500" />,
    error: <X className="text-red-500" />
  };

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-8 z-[200] sm:w-full sm:max-w-sm bg-white border border-slate-100 rounded-2xl sm:rounded-[2rem] shadow-2xl p-4 sm:p-6 flex items-start space-x-4 animate-in slide-in-from-top-4 sm:slide-in-from-right-6 border-l-4 border-l-ubuxa-blue">
      <div className="p-2 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl shadow-sm shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 text-sm sm:text-[15px] truncate">{title}</h4>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed font-medium line-clamp-2">{message}</p>
      </div>
      <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-lg shrink-0">
        <X size={16} />
      </button>
    </div>
  );
};
