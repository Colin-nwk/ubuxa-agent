
export enum SalesMode {
  OUTRIGHT = 'OUTRIGHT',
  FINANCED = 'FINANCED'
}

export enum PaymentType {
  CASH = 'CASH',
  MOMO = 'MOMO',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  location: string;
  status: 'ACTIVE' | 'BARRED';
  image?: string;
}

export interface InventoryItem {
  inventoryId: string;
  inventoryName: string;
  image: string;
  available: number;
  unitPrice: number;
  isSerialize: boolean;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  productName: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  date: string;
}

export interface AgentStats {
  totalSales: number;
  activeCustomers: number;
  inventoryValue: number;
  targetProgress: number;
}
