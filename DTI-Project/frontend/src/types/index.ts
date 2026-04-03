// types/index.ts

export type UserRole = 'supplier' | 'hotel' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Product ────────────────────────────────────────────────────────────────

export type StockStatus = 'sufficient' | 'low' | 'critical' | 'out';
export type ProductStatus = 'active' | 'inactive' | 'pending';

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  status: ProductStatus;
  supplierId: string;
  supplierName: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithStockStatus extends Product {
  stockStatus: StockStatus;
}

// ─── Consignment ─────────────────────────────────────────────────────────────

export interface ConsignmentItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  hotelId: string;
  hotelName: string;
  quantity: number;
  unitPrice: number;
  soldQuantity: number;
  remainingQuantity: number;
  lastUpdated: string;
}

// ─── Sales ───────────────────────────────────────────────────────────────────

export interface SaleRecord {
  id: string;
  productId: string;
  productName: string;
  hotelId: string;
  hotelName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  recordedBy: string;
  saleDate: string;
  createdAt: string;
}

export interface SalesReportData {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  topProducts: { name: string; sold: number; revenue: number }[];
  chartData: { label: string; value: number }[];
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface Payment {
  id: string;
  hotelId: string;
  hotelName: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  invoiceNumber: string;
  notes?: string;
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export type AlertSeverity = 'info' | 'warning' | 'danger';

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  hotelName: string;
  currentStock: number;
  minStock: number;
  severity: AlertSeverity;
  createdAt: string;
  isRead: boolean;
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// ─── Dashboard Metrics ───────────────────────────────────────────────────────

export interface SupplierMetrics {
  totalProducts: number;
  lowStockProducts: number;
  pendingPayments: number;
  monthlyRevenue: number;
  revenueGrowth: number;
}

export interface HotelMetrics {
  activeConsignments: number;
  todaySales: number;
  pendingPayments: number;
  lowStockItems: number;
}

export interface AdminMetrics {
  totalSuppliers: number;
  totalHotels: number;
  totalRevenue: number;
  overduePayments: number;
  activeProducts: number;
  complianceRate: number;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface AddProductForm {
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  status: ProductStatus;
}

export interface RecordSaleForm {
  productId: string;
  quantity: number;
  saleDate: string;
  notes?: string;
}

export interface SubmitPaymentForm {
  paymentId: string;
  amount: number;
  paymentDate: string;
  referenceNumber: string;
  notes?: string;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface PerformanceItem {
  product: string;
  sales: number;
  returns: number;
}

export interface PerformanceData {
  performanceData: PerformanceItem[];
}

export interface Metric {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

export interface HotelSalesData {
  hotel: string;
  sales: number;
}

export interface SalesMonitoringData {
  metrics: Metric[];
  hotelSalesData: HotelSalesData[];
}

export interface MonthlySalesData {
  month: string;
  sales: number;
}

export interface DailySalesData {
  day: string;
  sales: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface SummaryItem {
  label: string;
  value: string;
}

export interface SalesReportsData {
  monthlySales: MonthlySalesData[];
  dailySales: DailySalesData[];
  categoryData: CategoryData[];
  summary: SummaryItem[];
}
