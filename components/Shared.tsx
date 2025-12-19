
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
  FileSpreadsheet, 
  File, 
  Trash2,
  FileImage,
  ChevronDown,
  Bell,
  Info,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  AlertTriangle
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

export function DataTable<TData>({ data, columns, searchPlaceholder = "Search..." }: DataTableProps<TData>) {
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
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-gold focus:outline-none transition-all"
            placeholder={searchPlaceholder}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page Size:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {[5, 10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {table.getHeaderGroups().map(headerGroup => (
                    headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center space-x-2 ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <ArrowUpDown size={14} className={`transition-opacity ${header.column.getIsSorted() ? 'opacity-100 text-gold' : 'opacity-30'}`} />
                            )}
                          </div>
                        )}
                      </th>
                    ))
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 text-sm text-slate-700 font-medium">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                    <p className="text-sm font-bold">No results found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-1 text-xs font-bold text-slate-500">
            <span>Page</span>
            <span className="text-slate-900">{table.getState().pagination.pageIndex + 1}</span>
            <span>of</span>
            <span className="text-slate-900">{table.getPageCount()}</span>
            <span className="ml-2">({table.getFilteredRowModel().rows.length} total rows)</span>
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
    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-gold hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all shadow-sm"
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
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]'
  };

  const typeIcons = {
    default: null,
    success: <Check className="text-green-500" size={24} />,
    danger: <AlertCircle className="text-red-500" size={24} />,
    warning: <AlertTriangle className="text-gold" size={24} />,
    info: <Info className="text-blue-500" size={24} />
  };

  const typeHeaderColors = {
    default: 'bg-slate-900',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-gold',
    info: 'bg-blue-600'
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300`}>
        {/* Header */}
        <div className={`${typeHeaderColors[type]} p-8 text-white relative`}>
          <div className="flex items-center space-x-4">
            {type !== 'default' && (
              <div className="p-2 bg-white/20 rounded-xl">
                {typeIcons[type]}
              </div>
            )}
            <div>
              <h3 className="text-2xl font-serif font-bold leading-tight">{title}</h3>
              {subtitle && <p className="text-white/70 text-sm mt-1">{subtitle}</p>}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 text-slate-600">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-4">
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
  return (
    <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div className={`absolute top-0 right-0 h-full w-full ${maxWidth} bg-white shadow-2xl transition-transform duration-300 transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-slate-900 text-white p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-serif font-bold">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
        {footer && (
          <div className="p-8 border-t border-slate-100 bg-slate-50">
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
    className={`bg-gold-gradient text-slate-900 px-6 py-3 rounded-2xl font-bold shadow-lg shadow-gold/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center space-x-2 ${className}`}
    {...props}
  >
    {icon && <span>{icon}</span>}
    <span>{children}</span>
  </button>
);

export const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }> = ({ children, className, icon, ...props }) => (
  <button 
    className={`bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 ${className}`}
    {...props}
  >
    {icon && <span>{icon}</span>}
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
  <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
          activeTab === tab.id 
          ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
          : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {tab.icon && <span>{tab.icon}</span>}
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);

// --- ACCORDION ---
export const Accordion: React.FC<{ title: string, children: React.ReactNode, isOpen?: boolean, onToggle?: () => void }> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:border-gold">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left transition-colors"
      >
        <span className="font-bold text-slate-900 text-sm">{title}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] border-t border-slate-50' : 'max-h-0'}`}>
        <div className="p-5 text-sm text-slate-600 leading-relaxed bg-slate-50/50">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- MULTI-SELECT ---
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
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[52px] px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-gold transition-colors"
      >
        {selected.length === 0 ? (
          <span className="text-slate-400 text-sm">Select options...</span>
        ) : (
          selected.map(s => (
            <span key={s} className="bg-slate-900 text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 animate-in zoom-in-95">
              <span>{s}</span>
              <X size={12} className="cursor-pointer hover:text-gold" onClick={(e) => { e.stopPropagation(); toggleOption(s); }} />
            </span>
          ))
        )}
        <div className="ml-auto text-slate-400">
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 max-h-60 overflow-y-auto animate-in slide-in-from-top-2">
          {options.map(opt => (
            <div 
              key={opt}
              onClick={() => toggleOption(opt)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <span className={`text-sm font-medium ${selected.includes(opt) ? 'text-slate-900' : 'text-slate-500'}`}>{opt}</span>
              {selected.includes(opt) && <Check size={16} className="text-gold" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
        <div className="absolute z-50 right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in slide-in-from-top-2 zoom-in-95 origin-top-right">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.onClick(); setIsOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                item.variant === 'danger' ? 'text-red-500 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon && <span className="opacity-70">{item.icon}</span>}
              <span className="text-sm font-bold">{item.label}</span>
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
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    info: <Info className="text-blue-500" />,
    success: <Check className="text-green-500" />,
    warning: <AlertTriangle className="text-gold" />,
    error: <X className="text-red-500" />
  };

  return (
    <div className="fixed top-6 right-6 z-[200] w-full max-w-sm bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-6 flex items-start space-x-4 animate-in slide-in-from-right-4">
      <div className="p-3 bg-slate-50 rounded-2xl">
        {icons[type]}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        <p className="text-slate-500 text-xs mt-1 leading-relaxed">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-900 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

// --- FORMS ---
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: React.ReactNode }> = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input
        {...props}
        className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none transition-all ${props.className}`}
      />
    </div>
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
    <div className="relative">
      <select
        {...props}
        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-gold focus:outline-none appearance-none transition-all cursor-pointer ${props.className}`}
      >
        {children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <MoreVertical size={16} className="rotate-90" />
      </div>
    </div>
  </div>
);

export const Checkbox: React.FC<{ label: string, checked?: boolean, onChange?: (val: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${checked ? 'bg-slate-900 border-slate-900 shadow-md' : 'bg-white border-slate-200 group-hover:border-gold'}`}>
      {checked && <Check size={14} className="text-gold" strokeWidth={4} />}
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
    </div>
    <span className="text-sm font-medium text-slate-700 select-none">{label}</span>
  </label>
);

export const Switch: React.FC<{ label: string, enabled?: boolean, onChange?: (val: boolean) => void }> = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <button 
      type="button"
      onClick={() => onChange?.(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-gold-gradient shadow-inner' : 'bg-slate-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

export const FileUpload: React.FC<{ label: string, description?: string, accept?: string, onChange?: (file: File | null) => void }> = ({ label, description, accept, onChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (onChange) onChange(selected);

    if (selected && selected.type.startsWith('image/')) {
      const url = URL.createObjectURL(selected);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    if (onChange) onChange(null);
  };

  const getFileIcon = () => {
    if (!file) return <Upload size={20} className="text-slate-400 group-hover:text-slate-900" />;
    const type = file.type;
    const name = file.name.toLowerCase();

    if (type.startsWith('image/')) return <FileImage size={24} className="text-blue-500" />;
    if (type === 'application/pdf' || name.endsWith('.pdf')) return <FileText size={24} className="text-red-500" />;
    if (type.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) return <FileText size={24} className="text-blue-600" />;
    if (type.includes('excel') || type.includes('spreadsheet') || name.endsWith('.xls') || name.endsWith('.xlsx')) return <FileSpreadsheet size={24} className="text-green-600" />;
    
    return <File size={24} className="text-slate-400" />;
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[2rem] p-6 text-center transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[160px] ${
          file ? 'border-gold bg-gold/5 shadow-inner' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-gold'
        }`}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept={accept} 
          onChange={handleFileChange} 
        />

        {file ? (
          <div className="flex flex-col items-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
            {preview ? (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                {getFileIcon()}
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900 max-w-[200px] truncate">{file.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button 
              onClick={clearFile}
              className="absolute top-4 right-4 p-2 bg-white text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-gold transition-colors">
              {getFileIcon()}
            </div>
            <p className="text-sm font-bold text-slate-900">Click to upload or drag & drop</p>
            {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          </>
        )}
      </div>
    </div>
  );
};

// --- MAP ---
export const GoogleMapPlaceholder: React.FC<{ address?: string }> = ({ address }) => (
  <div className="relative w-full h-[300px] bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200">
    <div className="absolute inset-0 opacity-20" style={{ 
      backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', 
      backgroundSize: '30px 30px' 
    }}></div>
    <div className="absolute top-4 left-4 right-4 flex items-center space-x-2">
      <div className="flex-1 bg-white/90 backdrop-blur shadow-lg rounded-2xl px-4 py-2 border border-slate-100 flex items-center">
        <Search size={16} className="text-slate-400 mr-2" />
        <span className="text-xs font-medium text-slate-600 truncate">{address || 'Search coordinates...'}</span>
      </div>
      <button className="bg-slate-900 text-white p-2 rounded-2xl shadow-lg">
        <MapPin size={18} />
      </button>
    </div>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
       <div className="relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-xl">
             Customer Location
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
          <div className="w-8 h-8 bg-gold-gradient rounded-full shadow-2xl flex items-center justify-center border-4 border-white animate-pulse">
             <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
          </div>
       </div>
    </div>
    <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
      <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center font-bold text-slate-600">+</button>
      <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center font-bold text-slate-600">-</button>
    </div>
  </div>
);

// --- STATS ---
export const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend?: string, positive?: boolean }> = ({ title, value, icon, trend, positive }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:border-gold transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-gold-gradient transition-all duration-300">
        {icon}
      </div>
      <button className="text-slate-400">
        <MoreVertical size={16} />
      </button>
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <div className="flex items-baseline space-x-2 mt-1">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <span className={`text-xs font-bold flex items-center ${positive ? 'text-green-500' : 'text-red-500'}`}>
            {positive ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);
