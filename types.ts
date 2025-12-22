
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
  status: 'ACTIVE' | 'BARRED' | 'DEFAULTING';
  image?: string;
  balance?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  image?: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  productName: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  date: string;
  paymentPlan: 'OUTRIGHT' | 'FINANCED';
}

export interface InstallerTask {
  id: string;
  customerName: string;
  address: string;
  package: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  date: string;
  coordinates?: { lat: number, lng: number };
}

export interface Transaction {
  id: string;
  type: 'PAYMENT' | 'COMMISSION' | 'REVERSAL';
  amount: number;
  date: string;
  description: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'SALE' | 'PAYMENT' | 'ALERT' | 'TASK';
  read: boolean;
  time: string;
}
