import { prisma } from '../config/db';
import { demoProfiles, ensureDemoData } from '../data/demoSeed';
import { hashPassword } from '../utils/auth';

type DbUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  status: string;
  createdAt: Date;
};

type DbProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type DbPayment = {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: Date;
  paidDate: Date | null;
  createdAt: Date;
};

const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number) => currency.format(value);

export const roleFromDb = (role: string) => role.toLowerCase() as 'supplier' | 'hotel' | 'admin';
export const statusFromDb = (status: string) => status.toLowerCase() as 'active' | 'inactive';
export const paymentStatusFromDb = (status: string) => status.toLowerCase() as 'paid' | 'pending' | 'overdue';

const productProfile = (name: string) => demoProfiles.products.find((product) => product.name === name);

export async function loadBaseData() {
  await ensureDemoData(prisma);

  const [users, products, inventories, sales, payments, consignments, auditLogs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.product.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.hotelInventory.findMany(),
    prisma.sale.findMany({ orderBy: { recordedAt: 'desc' } }),
    prisma.payment.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.consignment.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return { users, products, inventories, sales, payments, consignments, auditLogs };
}

export function buildUserDto(user: DbUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleFromDb(user.role),
    company: user.company,
    status: statusFromDb(user.status),
    createdAt: user.createdAt.toISOString(),
  };
}

export function buildProductDto(product: DbProduct, stock: number, supplierName: string) {
  const profile = productProfile(product.name);

  return {
    id: product.id,
    name: product.name,
    category: profile?.description.split(' | ')[0] || 'General',
    sku: profile?.description.split('SKU ')[1] || product.id.slice(0, 6).toUpperCase(),
    price: product.price,
    stock,
    minStock: stock > 60 ? 15 : 10,
    status: statusFromDb(product.status),
    supplierId: supplierName,
    supplierName,
    imageUrl: undefined,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function buildPaymentDto(payment: DbPayment, hotelName: string, supplierName: string) {
  return {
    id: payment.id,
    hotelId: hotelName,
    hotelName,
    supplierId: supplierName,
    supplierName,
    amount: payment.amount,
    dueDate: payment.dueDate.toISOString(),
    paidDate: payment.paidDate?.toISOString(),
    status: paymentStatusFromDb(payment.status),
    invoiceNumber: payment.invoiceNumber,
    notes: undefined,
  };
}

export function buildAlertDto(params: {
  id: string;
  productName: string;
  hotelName: string;
  currentStock: number;
  minStock: number;
  createdAt: string;
}) {
  const severity = params.currentStock <= Math.max(3, Math.floor(params.minStock * 0.3)) ? 'danger' : 'warning';

  return {
    id: params.id,
    productId: params.id,
    productName: params.productName,
    hotelName: params.hotelName,
    currentStock: params.currentStock,
    minStock: params.minStock,
    severity,
    createdAt: params.createdAt,
    isRead: false,
  };
}

export function getInventoryStock(inventories: Array<{ productId: string; quantity: number }>, productId: string) {
  return inventories.filter((inventory) => inventory.productId === productId).reduce((sum, inventory) => sum + inventory.quantity, 0);
}

export async function createUserRecord(input: {
  email: string;
  name: string;
  role: 'supplier' | 'hotel' | 'admin';
  company: string;
  password: string;
}) {
  return prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      role: input.role.toUpperCase() as 'SUPPLIER' | 'HOTEL' | 'ADMIN',
      company: input.company,
      password: await hashPassword(input.password),
      status: 'ACTIVE',
    },
  });
}

export { demoProfiles };
