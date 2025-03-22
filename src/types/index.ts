
export type UserRole = 'admin' | 'manager' | 'cashier' | 'inventory' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  minStockLevel: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  schedules: Schedule[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  employeeId: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
}

export interface Sale {
  id: string;
  date: Date;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  cashierId: string;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DashboardStats {
  totalSalesToday: number;
  totalSalesWeek: number;
  totalSalesMonth: number;
  lowStockItems: number;
  activeEmployees: number;
  topProducts: {
    productName: string;
    quantity: number;
    total: number;
  }[];
}
