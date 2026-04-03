import { PrismaClient, UserRole, UserStatus, ProductStatus, PaymentStatus, ConsignmentStatus, AuditAction } from '../generated/prisma/client';
import { hashPassword } from '../utils/auth';

type DemoUser = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company: string;
  status: UserStatus;
};

type DemoProduct = {
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
};

const demoUsers: DemoUser[] = [
  { email: 'maria@cleanco.ph', password: 'Password123!', name: 'Maria Santos', role: 'SUPPLIER', company: 'CleanCo Supplies', status: 'ACTIVE' },
  { email: 'juan@grandplaza.ph', password: 'Password123!', name: 'Juan Reyes', role: 'HOTEL', company: 'Grand Plaza Hotel', status: 'ACTIVE' },
  { email: 'ana@textilepro.ph', password: 'Password123!', name: 'Ana Cruz', role: 'SUPPLIER', company: 'TextilePro Inc.', status: 'ACTIVE' },
  { email: 'carlos@seaside.ph', password: 'Password123!', name: 'Carlos Lim', role: 'HOTEL', company: 'Seaside Resort', status: 'INACTIVE' },
  { email: 'rosa@mountainview.ph', password: 'Password123!', name: 'Rosa Dela Cruz', role: 'HOTEL', company: 'Mountain View Inn', status: 'ACTIVE' },
  { email: 'pedro@hotelessen.ph', password: 'Password123!', name: 'Pedro Reyes', role: 'SUPPLIER', company: 'HotelEssentials', status: 'INACTIVE' },
  { email: 'lisa@citycenter.ph', password: 'Password123!', name: 'Lisa Garcia', role: 'HOTEL', company: 'City Center Hotel', status: 'ACTIVE' },
  { email: 'dti@dti.gov.ph', password: 'Password123!', name: 'DTI Officer', role: 'ADMIN', company: 'DTI Compliance Desk', status: 'ACTIVE' },
];

const demoProducts: DemoProduct[] = [
  { name: 'Premium Shampoo 500ml', description: 'Toiletries | SKU SHP-001', price: 180, status: 'ACTIVE' },
  { name: 'Bath Soap Set (3pc)', description: 'Amenities | SKU SAP-002', price: 95, status: 'ACTIVE' },
  { name: 'Hand Towels (6pc)', description: 'Linens | SKU TOW-003', price: 450, status: 'ACTIVE' },
  { name: 'Shower Gel 250ml', description: 'Toiletries | SKU GEL-004', price: 210, status: 'ACTIVE' },
  { name: 'Dental Kit', description: 'Amenities | SKU DEN-005', price: 55, status: 'ACTIVE' },
  { name: 'Body Lotion 300ml', description: 'Toiletries | SKU LOT-006', price: 260, status: 'ACTIVE' },
  { name: 'Slippers (Pair)', description: 'Amenities | SKU SLP-007', price: 85, status: 'ACTIVE' },
  { name: 'Conditioner 500ml', description: 'Toiletries | SKU CON-008', price: 195, status: 'ACTIVE' },
];

const hotelSeed = [
  { company: 'Grand Plaza Hotel', inventory: [45, 120, 30, 68, 85, 42, 55, 38] },
  { company: 'Seaside Resort', inventory: [18, 75, 16, 24, 30, 18, 20, 14] },
  { company: 'Mountain View Inn', inventory: [12, 60, 9, 18, 22, 10, 12, 8] },
  { company: 'City Center Hotel', inventory: [28, 95, 24, 40, 50, 26, 33, 21] },
  { company: 'Bayfront Hotel', inventory: [20, 48, 11, 14, 19, 9, 15, 7] },
];

const paymentSeed = [
  { invoiceNumber: 'INV-1001', supplier: 'CleanCo Supplies', hotel: 'Grand Plaza Hotel', amount: 45000, status: 'PAID', dueDate: new Date('2026-03-15'), paidDate: new Date('2026-03-14') },
  { invoiceNumber: 'INV-1002', supplier: 'TextilePro Inc.', hotel: 'Seaside Resort', amount: 32500, status: 'PENDING', dueDate: new Date('2026-03-18'), paidDate: null },
  { invoiceNumber: 'INV-1003', supplier: 'HotelEssentials', hotel: 'Mountain View Inn', amount: 28000, status: 'OVERDUE', dueDate: new Date('2026-03-10'), paidDate: null },
  { invoiceNumber: 'INV-1004', supplier: 'CleanCo Supplies', hotel: 'City Center Hotel', amount: 51200, status: 'PAID', dueDate: new Date('2026-03-20'), paidDate: new Date('2026-03-20') },
  { invoiceNumber: 'INV-1005', supplier: 'TextilePro Inc.', hotel: 'Bayfront Hotel', amount: 19800, status: 'PENDING', dueDate: new Date('2026-03-22'), paidDate: null },
  { invoiceNumber: 'INV-1006', supplier: 'CleanCo Supplies', hotel: 'Grand Plaza Hotel', amount: 125000, status: 'PAID', dueDate: new Date('2026-03-15'), paidDate: new Date('2026-03-14') },
  { invoiceNumber: 'INV-1007', supplier: 'TextilePro Inc.', hotel: 'Seaside Resort', amount: 78500, status: 'PENDING', dueDate: new Date('2026-03-20'), paidDate: null },
  { invoiceNumber: 'INV-1008', supplier: 'HotelEssentials', hotel: 'Mountain View Inn', amount: 45200, status: 'OVERDUE', dueDate: new Date('2026-03-10'), paidDate: null },
  { invoiceNumber: 'INV-1009', supplier: 'CleanCo Supplies', hotel: 'City Center Hotel', amount: 92300, status: 'PAID', dueDate: new Date('2026-03-18'), paidDate: new Date('2026-03-17') },
  { invoiceNumber: 'INV-1010', supplier: 'TextilePro Inc.', hotel: 'Grand Plaza Hotel', amount: 63700, status: 'PENDING', dueDate: new Date('2026-03-22'), paidDate: null },
  { invoiceNumber: 'INV-1011', supplier: 'CleanCo Supplies', hotel: 'Bayfront Hotel', amount: 38900, status: 'OVERDUE', dueDate: new Date('2026-03-05'), paidDate: null },
];

const saleSeed = [
  { hotel: 'Grand Plaza Hotel', product: 'Premium Shampoo 500ml', quantity: 3, totalAmount: 540, recordedAt: new Date('2026-03-31T14:15:22Z') },
  { hotel: 'Grand Plaza Hotel', product: 'Bath Soap Set (3pc)', quantity: 10, totalAmount: 950, recordedAt: new Date('2026-03-30T16:45:12Z') },
  { hotel: 'Seaside Resort', product: 'Dental Kit', quantity: 5, totalAmount: 275, recordedAt: new Date('2026-03-31T14:15:22Z') },
  { hotel: 'Mountain View Inn', product: 'Shower Gel 250ml', quantity: 4, totalAmount: 840, recordedAt: new Date('2026-03-29T13:48:10Z') },
  { hotel: 'City Center Hotel', product: 'Body Lotion 300ml', quantity: 6, totalAmount: 1560, recordedAt: new Date('2026-03-30T12:05:30Z') },
  { hotel: 'Bayfront Hotel', product: 'Hand Towels (6pc)', quantity: 2, totalAmount: 900, recordedAt: new Date('2026-03-28T10:02:33Z') },
  { hotel: 'Grand Plaza Hotel', product: 'Premium Shampoo 500ml', quantity: 9, totalAmount: 1620, recordedAt: new Date('2026-01-05T10:00:00Z') },
  { hotel: 'Seaside Resort', product: 'Bath Soap Set (3pc)', quantity: 12, totalAmount: 1140, recordedAt: new Date('2026-02-07T10:00:00Z') },
  { hotel: 'Mountain View Inn', product: 'Shower Gel 250ml', quantity: 11, totalAmount: 2310, recordedAt: new Date('2026-03-12T10:00:00Z') },
  { hotel: 'City Center Hotel', product: 'Body Lotion 300ml', quantity: 15, totalAmount: 3900, recordedAt: new Date('2026-04-18T10:00:00Z') },
  { hotel: 'Bayfront Hotel', product: 'Hand Towels (6pc)', quantity: 18, totalAmount: 8100, recordedAt: new Date('2026-05-11T10:00:00Z') },
  { hotel: 'Grand Plaza Hotel', product: 'Conditioner 500ml', quantity: 20, totalAmount: 3900, recordedAt: new Date('2026-06-02T10:00:00Z') },
];

const consignmentSeed = [
  { supplier: 'CleanCo Supplies', hotel: 'Grand Plaza Hotel', status: 'ACTIVE', items: [
    { product: 'Premium Shampoo 500ml', quantity: 45 },
    { product: 'Bath Soap Set (3pc)', quantity: 120 },
    { product: 'Shower Gel 250ml', quantity: 68 },
  ] },
  { supplier: 'TextilePro Inc.', hotel: 'Seaside Resort', status: 'ACTIVE', items: [
    { product: 'Hand Towels (6pc)', quantity: 30 },
    { product: 'Slippers (Pair)', quantity: 55 },
  ] },
  { supplier: 'CleanCo Supplies', hotel: 'Mountain View Inn', status: 'ACTIVE', items: [
    { product: 'Dental Kit', quantity: 85 },
    { product: 'Body Lotion 300ml', quantity: 42 },
    { product: 'Conditioner 500ml', quantity: 38 },
  ] },
  { supplier: 'TextilePro Inc.', hotel: 'City Center Hotel', status: 'ACTIVE', items: [
    { product: 'Hand Towels (6pc)', quantity: 24 },
    { product: 'Slippers (Pair)', quantity: 33 },
  ] },
];

const auditSeed = [
  { user: 'Maria Santos', action: 'CREATE', entity: 'Product', details: 'Added Premium Shampoo 500ml', createdAt: new Date('2026-03-31T14:32:05Z') },
  { user: 'Juan Reyes', action: 'SALE_RECORDED', entity: 'Sale', details: '5x Dental Kit — Grand Plaza Hotel', createdAt: new Date('2026-03-31T14:15:22Z') },
  { user: 'System', action: 'UPDATE', entity: 'Alert', details: 'Hand Towels at Seaside Resort reached critical stock', createdAt: new Date('2026-03-31T13:48:10Z') },
  { user: 'Ana Cruz', action: 'UPDATE', entity: 'Product', details: 'Changed price of Shower Gel from ₱200 to ₱210', createdAt: new Date('2026-03-31T12:30:00Z') },
  { user: 'Carlos Lim', action: 'PAYMENT_PROCESSED', entity: 'Payment', details: '₱32,500 to CleanCo Supplies', createdAt: new Date('2026-03-31T11:15:44Z') },
  { user: 'DTI Officer', action: 'UPDATE', entity: 'User', details: 'Deactivated user Pedro Reyes', createdAt: new Date('2026-03-31T10:02:33Z') },
  { user: 'Rosa Dela Cruz', action: 'SALE_RECORDED', entity: 'Sale', details: '10x Bath Soap Set — Mountain View Inn', createdAt: new Date('2026-03-30T16:45:12Z') },
  { user: 'System', action: 'UPDATE', entity: 'Report', details: 'Monthly sales report generated for March 2026', createdAt: new Date('2026-03-30T15:20:08Z') },
  { user: 'Lisa Garcia', action: 'PAYMENT_PROCESSED', entity: 'Payment', details: '₱51,200 to TextilePro Inc.', createdAt: new Date('2026-03-30T14:10:55Z') },
  { user: 'Maria Santos', action: 'UPDATE', entity: 'Inventory', details: 'Added 50 units of Body Lotion to Mountain View Inn', createdAt: new Date('2026-03-30T12:05:30Z') },
  { user: 'DTI Officer', action: 'CREATE', entity: 'User', details: 'Approved supplier FreshSupplies Co.', createdAt: new Date('2026-03-30T10:30:18Z') },
  { user: 'System', action: 'UPDATE', entity: 'Payment', details: 'HotelEssentials overdue payment alert generated', createdAt: new Date('2026-03-29T16:22:40Z') },
];

async function seedUsers(prisma: PrismaClient) {
  const hashedPasswords = await Promise.all(demoUsers.map(async (user) => ({ ...user, password: await hashPassword(user.password) })));

  await prisma.user.createMany({
    data: hashedPasswords,
    skipDuplicates: true,
  });
}

async function seedProducts(prisma: PrismaClient) {
  await prisma.product.createMany({
    data: demoProducts,
    skipDuplicates: true,
  });
}

async function seedInventory(prisma: PrismaClient) {
  const users = await prisma.user.findMany({ where: { role: 'HOTEL' } });
  const products = await prisma.product.findMany();
  const inventoryRows = hotelSeed.flatMap((hotel, hotelIndex) => {
    const hotelUser = users.find((user) => user.company === hotel.company);

    return products.map((product, productIndex) => ({
      hotelId: hotelUser?.id || `hotel-${hotelIndex}`,
      productId: product.id,
      quantity: hotel.inventory[productIndex] ?? 0,
      minThreshold: productIndex % 2 === 0 ? 10 : 15,
    }));
  });

  await prisma.hotelInventory.createMany({
    data: inventoryRows,
    skipDuplicates: true,
  });
}

async function seedSales(prisma: PrismaClient) {
  const users = await prisma.user.findMany({ where: { role: 'HOTEL' } });
  const products = await prisma.product.findMany();

  const hotelMap = new Map(users.map((user) => [user.company, user.id]));
  const productMap = new Map(products.map((product) => [product.name, product.id]));

  await prisma.sale.createMany({
    data: saleSeed.map((sale) => ({
      hotelId: hotelMap.get(sale.hotel) || users[0]?.id || 'hotel-demo',
      productId: productMap.get(sale.product) || null,
      quantity: sale.quantity,
      totalAmount: sale.totalAmount,
      recordedAt: sale.recordedAt,
    })),
    skipDuplicates: true,
  });
}

async function seedPayments(prisma: PrismaClient) {
  const suppliers = await prisma.user.findMany({ where: { role: 'SUPPLIER' } });
  const hotels = await prisma.user.findMany({ where: { role: 'HOTEL' } });
  const supplierMap = new Map(suppliers.map((user) => [user.company, user.id]));
  const hotelMap = new Map(hotels.map((user) => [user.company, user.id]));

  await prisma.payment.createMany({
    data: paymentSeed.map((payment) => ({
      invoiceNumber: payment.invoiceNumber,
      supplierId: supplierMap.get(payment.supplier) || suppliers[0]?.id || 'supplier-demo',
      hotelId: hotelMap.get(payment.hotel) || hotels[0]?.id || 'hotel-demo',
      amount: payment.amount,
      status: payment.status as PaymentStatus,
      dueDate: payment.dueDate,
      paidDate: payment.paidDate,
    })),
    skipDuplicates: true,
  });
}

async function seedConsignments(prisma: PrismaClient) {
  const suppliers = await prisma.user.findMany({ where: { role: 'SUPPLIER' } });
  const hotels = await prisma.user.findMany({ where: { role: 'HOTEL' } });
  const products = await prisma.product.findMany();
  const supplierMap = new Map(suppliers.map((user) => [user.company, user.id]));
  const hotelMap = new Map(hotels.map((user) => [user.company, user.id]));
  const productMap = new Map(products.map((product) => [product.name, product.id]));

  for (const entry of consignmentSeed) {
    const consignment = await prisma.consignment.create({
      data: {
        supplierId: supplierMap.get(entry.supplier) || suppliers[0]?.id || 'supplier-demo',
        hotelId: hotelMap.get(entry.hotel) || hotels[0]?.id || 'hotel-demo',
        status: entry.status as ConsignmentStatus,
      },
    });

    await prisma.consignmentItem.createMany({
      data: entry.items.map((item) => ({
        consignmentId: consignment.id,
        productId: productMap.get(item.product) || products[0]?.id || 'product-demo',
        quantity: item.quantity,
      })),
    });
  }
}

async function seedAuditLogs(prisma: PrismaClient) {
  const users = await prisma.user.findMany();
  const userMap = new Map(users.map((user) => [user.name, user.id]));

  await prisma.auditLog.createMany({
    data: auditSeed.map((entry) => ({
      userId: userMap.get(entry.user) || users[0]?.id || 'user-demo',
      action: entry.action as AuditAction,
      entity: entry.entity,
      entityId: null,
      changes: { details: entry.details },
      createdAt: entry.createdAt,
    })),
    skipDuplicates: true,
  });
}

export async function ensureDemoData(prisma: PrismaClient): Promise<void> {
  const userCount = await prisma.user.count();

  if (userCount > 0) {
    return;
  }

  await seedUsers(prisma);
  await seedProducts(prisma);
  await seedInventory(prisma);
  await seedSales(prisma);
  await seedPayments(prisma);
  await seedConsignments(prisma);
  await seedAuditLogs(prisma);
}

export const demoProfiles = {
  products: demoProducts,
  hotels: hotelSeed,
  users: demoUsers,
};
