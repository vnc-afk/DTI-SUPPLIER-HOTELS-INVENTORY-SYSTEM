import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { hashPassword } from '../utils/auth';
import { demoProfiles, ensureDemoData } from '../data/demoSeed';

const roleFromDb = (role: string) => role.toLowerCase() as 'supplier' | 'hotel' | 'admin';
const statusFromDb = (status: string) => status.toLowerCase() as 'active' | 'inactive';
const paymentStatusFromDb = (status: string) => status.toLowerCase() as 'paid' | 'pending' | 'overdue';

const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });
const formatCurrency = (value: number) => currency.format(value);

const productProfile = (name: string) => demoProfiles.products.find((product) => product.name === name);
const hotelNames = demoProfiles.hotels.map((hotel) => hotel.company);

async function loadBaseData() {
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

function buildUserDto(user: { id: string; name: string; email: string; role: string; company: string; status: string; createdAt: Date }) {
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

function buildProductDto(product: { id: string; name: string; description: string | null; price: number; status: string; createdAt: Date; updatedAt: Date }, stock: number, supplierName: string) {
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

function buildPaymentDto(payment: { id: string; invoiceNumber: string; amount: number; status: string; dueDate: Date; paidDate: Date | null; createdAt: Date }, hotelName: string, supplierName: string) {
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

function getInventoryStock(inventories: Array<{ productId: string; quantity: number }>, productId: string) {
  return inventories.filter((inventory) => inventory.productId === productId).reduce((sum, inventory) => sum + inventory.quantity, 0);
}

function getSupplierNameForProduct(productName: string) {
  if (productName === 'Hand Towels (6pc)' || productName === 'Slippers (Pair)') {
    return 'TextilePro Inc.';
  }

  return 'CleanCo Supplies';
}

export async function listUsers(req: Request, res: Response) {
  const data = await loadBaseData();
  const search = String(req.query.search || '').toLowerCase();

  const users = data.users
    .map(buildUserDto)
    .filter((user) => !search || user.name.toLowerCase().includes(search) || user.company.toLowerCase().includes(search));

  res.json(users);
}

export async function createUser(req: Request, res: Response) {
  const { email, name, role, company, password = 'Password123!' } = req.body ?? {};

  if (!email || !name || !role || !company) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }

  const created = await prisma.user.create({
    data: {
      email,
      name,
      role: role.toUpperCase(),
      company,
      password: await hashPassword(password),
      status: 'ACTIVE',
    },
  });

  res.status(201).json(buildUserDto(created));
}

export async function toggleUserStatus(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' },
  });

  res.json(buildUserDto(updated));
}

export async function listProducts(_req: Request, res: Response) {
  const data = await loadBaseData();
  const supplierName = 'CleanCo Supplies';
  const products = data.products.map((product) => buildProductDto(product, getInventoryStock(data.inventories, product.id), supplierName));

  res.json(products);
}

export async function createProduct(req: Request, res: Response) {
  const { name, description, price } = req.body ?? {};

  if (!name || typeof price !== 'number') {
    res.status(400).json({ error: 'Missing product name or price' });
    return;
  }

  const created = await prisma.product.create({
    data: {
      name,
      description: description || null,
      price,
      status: 'ACTIVE',
    },
  });

  res.status(201).json(created);
}

export async function listConsignments(_req: Request, res: Response) {
  const data = await loadBaseData();
  const products = new Map(data.products.map((product) => [product.id, product.name]));
  const hotels = new Map(data.users.filter((user) => user.role === 'HOTEL').map((user) => [user.id, user.company]));
  const suppliers = new Map(data.users.filter((user) => user.role === 'SUPPLIER').map((user) => [user.id, user.company]));

  const rows = await prisma.consignment.findMany({ include: { items: true } });

  const items = rows.flatMap((consignment) => consignment.items.map((item) => {
    const productName = products.get(item.productId) || 'Product';
    const supplierName = suppliers.get(consignment.supplierId) || 'Supplier';
    const hotelName = hotels.get(consignment.hotelId) || 'Hotel';

    return {
      id: item.id,
      name: productName,
      supplier: supplierName,
      hotel: hotelName,
      qty: item.quantity,
      price: formatCurrency(productProfile(productName)?.price || 0),
      image: '🏨',
    };
  }));

  res.json(items);
}

export async function listSales(_req: Request, res: Response) {
  const data = await loadBaseData();
  const products = new Map(data.products.map((product) => [product.id, product.name]));
  const hotels = new Map(data.users.filter((user) => user.role === 'HOTEL').map((user) => [user.id, user.company]));

  const recent = data.sales.slice(0, 5).map((sale) => ({
    id: sale.id,
    product: sale.productId ? products.get(sale.productId) || 'Product' : 'Product',
    hotel: hotels.get(sale.hotelId) || 'Hotel',
    qty: sale.quantity,
    total: formatCurrency(sale.totalAmount),
    time: sale.recordedAt.toISOString(),
  }));

  res.json(recent);
}

export async function recordSale(req: Request, res: Response) {
  const { productId, quantity, hotelId } = req.body ?? {};

  if (!productId || !quantity) {
    res.status(400).json({ error: 'Missing productId or quantity' });
    return;
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const hotel = hotelId ? await prisma.user.findUnique({ where: { id: hotelId } }) : await prisma.user.findFirst({ where: { role: 'HOTEL' }, orderBy: { createdAt: 'asc' } });

  const created = await prisma.sale.create({
    data: {
      hotelId: hotel?.id || 'hotel-demo',
      productId: product.id,
      quantity: Number(quantity),
      totalAmount: product.price * Number(quantity),
      recordedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: hotel?.id || (await prisma.user.findFirst({ where: { role: 'ADMIN' } }))?.id || 'user-demo',
      action: 'SALE_RECORDED',
      entity: 'Sale',
      entityId: created.id,
      changes: { productId: product.id, quantity: Number(quantity) },
    },
  });

  res.status(201).json({
    id: created.id,
    product: product.name,
    qty: created.quantity,
    total: formatCurrency(created.totalAmount),
    time: created.recordedAt.toISOString(),
  });
}

export async function listPayments(_req: Request, res: Response) {
  const data = await loadBaseData();
  const hotels = new Map(data.users.filter((user) => user.role === 'HOTEL').map((user) => [user.id, user.company]));
  const suppliers = new Map(data.users.filter((user) => user.role === 'SUPPLIER').map((user) => [user.id, user.company]));

  const payments = data.payments.map((payment) => buildPaymentDto(payment, hotels.get(payment.hotelId) || 'Hotel', suppliers.get(payment.supplierId) || 'Supplier'));

  res.json(payments);
}

export async function submitPayment(req: Request, res: Response) {
  const { supplierName, hotelName, amount, referenceNumber, paymentDate } = req.body ?? {};

  if (!supplierName || !hotelName || typeof amount !== 'number') {
    res.status(400).json({ error: 'Missing supplier, hotel, or amount' });
    return;
  }

  const supplier = await prisma.user.findFirst({ where: { company: supplierName, role: 'SUPPLIER' } });
  const hotel = await prisma.user.findFirst({ where: { company: hotelName, role: 'HOTEL' } });

  const created = await prisma.payment.create({
    data: {
      invoiceNumber: referenceNumber || `INV-${Date.now()}`,
      supplierId: supplier?.id || (await prisma.user.findFirst({ where: { role: 'SUPPLIER' } }))?.id || 'supplier-demo',
      hotelId: hotel?.id || (await prisma.user.findFirst({ where: { role: 'HOTEL' } }))?.id || 'hotel-demo',
      amount: Number(amount),
      status: 'PENDING',
      dueDate: paymentDate ? new Date(paymentDate) : new Date(),
      paidDate: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: hotel?.id || (await prisma.user.findFirst({ where: { role: 'ADMIN' } }))?.id || 'user-demo',
      action: 'PAYMENT_PROCESSED',
      entity: 'Payment',
      entityId: created.id,
      changes: { referenceNumber },
    },
  });

  res.status(201).json(buildPaymentDto(created, hotel?.company || hotelName, supplier?.company || supplierName));
}

export async function listAlerts(_req: Request, res: Response) {
  const data = await loadBaseData();
  const products = new Map(data.products.map((product) => [product.id, product.name]));
  const hotels = new Map(data.users.filter((user) => user.role === 'HOTEL').map((user) => [user.id, user.company]));

  const alerts = data.inventories
    .map((inventory) => {
      const productName = products.get(inventory.productId) || 'Product';
      const hotelName = hotels.get(inventory.hotelId) || 'Hotel';
      const minStock = inventory.minThreshold;
      const severity = inventory.quantity <= Math.max(3, Math.floor(minStock * 0.3)) ? 'critical' : 'warning';

      return {
        id: `${inventory.hotelId}-${inventory.productId}`,
        product: productName,
        hotel: hotelName,
        stock: inventory.quantity,
        minStock,
        severity,
        time: 'just now',
      };
    })
    .filter((alert) => alert.stock <= alert.minStock)
    .slice(0, 12);

  res.json(alerts);
}

export async function listAuditLogs(req: Request, res: Response) {
  const data = await loadBaseData();
  const search = String(req.query.search || '').toLowerCase();
  const users = new Map(data.users.map((user) => [user.id, user.name]));

  const logs = data.auditLogs
    .map((log) => ({
      id: log.id,
      timestamp: log.createdAt.toISOString().replace('T', ' ').slice(0, 19),
      user: users.get(log.userId) || 'System',
      action: log.entity === 'Payment' ? 'Submitted payment' : log.entity === 'Sale' ? 'Recorded sale' : `${log.action}`,
      details: typeof log.changes === 'object' && log.changes && 'details' in log.changes ? String((log.changes as { details?: string }).details) : `${log.entity} update`,
      type: log.entity === 'Payment' ? 'payment' : log.entity === 'Sale' ? 'sale' : log.entity === 'User' ? 'admin' : log.entity === 'Alert' ? 'alert' : 'system',
    }))
    .filter((log) => !search || log.user.toLowerCase().includes(search) || log.action.toLowerCase().includes(search) || log.details.toLowerCase().includes(search));

  res.json(logs);
}

export async function getDashboard(req: Request, res: Response) {
  const role = String(req.query.role || 'supplier');
  const data = await loadBaseData();
  const products = new Map(data.products.map((product) => [product.id, product.name]));
  const usersMap = new Map(data.users.map((user) => [user.id, user.name]));
  const hotels = new Map(data.users.filter((user) => user.role === 'HOTEL').map((user) => [user.id, user.company]));
  const suppliers = new Map(data.users.filter((user) => user.role === 'SUPPLIER').map((user) => [user.id, user.company]));

  const paidPayments = data.payments.filter((payment) => payment.status === 'PAID');
  const lowInventory = data.inventories.filter((inventory) => inventory.quantity <= inventory.minThreshold);

  if (role === 'hotel') {
    const hotelName = hotelNames[0];
    const hotelUser = data.users.find((user) => user.company === hotelName);
    const consignmentItems = data.products.slice(0, 4).map((product, index) => ({
      name: product.name,
      supplier: index % 2 === 0 ? 'CleanCo Supplies' : 'TextilePro Inc.',
      qty: data.inventories.filter((inventory) => inventory.productId === product.id).reduce((sum, inventory) => sum + inventory.quantity, 0),
      price: formatCurrency(product.price),
    }));

    const weeklySales = [
      { week: 'Week 1', sales: 1200 },
      { week: 'Week 2', sales: 1800 },
      { week: 'Week 3', sales: 1500 },
      { week: 'Week 4', sales: 2200 },
    ];

    res.json({
      metrics: [
        { title: 'Products on Hand', value: 263 },
        { title: 'Sales Today', value: 18, trend: '↑ 5 from yesterday', trendUp: true },
        { title: 'Revenue (Week)', value: '₱28.5K', trend: '↑ 12%', trendUp: true },
        { title: 'Pending Payment', value: '₱45K', trend: 'Due in 5 days' },
      ],
      chartData: weeklySales,
      items: consignmentItems,
      hotel: hotelUser?.company || hotelName,
    });
    return;
  }

  if (role === 'admin') {
    const performanceData = [
      { product: 'Shampoo', sales: 820, returns: 12 },
      { product: 'Soap', sales: 1450, returns: 25 },
      { product: 'Towels', sales: 340, returns: 5 },
      { product: 'Gel', sales: 690, returns: 8 },
      { product: 'Lotion', sales: 520, returns: 15 },
    ];

    const recentActivity = data.auditLogs.slice(0, 5).map((log) => ({
      action: log.entity === 'Payment' ? 'Payment received' : log.entity === 'User' ? 'User account updated' : 'System update',
      user: usersMap.get(log.userId) || 'System',
      time: log.createdAt.toISOString(),
    }));

    const compliance = data.payments.slice(0, 3).map((payment) => buildPaymentDto(payment, hotels.get(payment.hotelId) || 'Hotel', suppliers.get(payment.supplierId) || 'Supplier'));

    res.json({
      metrics: [
        { title: 'Total Users', value: data.users.length },
        { title: 'Active Suppliers', value: data.users.filter((user) => user.role === 'SUPPLIER' && user.status === 'ACTIVE').length },
        { title: 'Total Sales (Month)', value: '₱1.2M', trend: '↑ 15.3%', trendUp: true },
        { title: 'Compliance Rate', value: '92%', trend: '↑ 3%', trendUp: true },
      ],
      performanceData,
      recentActivity,
      compliance,
    });
    return;
  }

  const salesData = [
    { month: 'Jan', sales: 4200 },
    { month: 'Feb', sales: 3800 },
    { month: 'Mar', sales: 5100 },
    { month: 'Apr', sales: 4600 },
    { month: 'May', sales: 5800 },
    { month: 'Jun', sales: 6200 },
  ];

  const lowStockItems = lowInventory.slice(0, 3).map((inventory) => ({
    product: products.get(inventory.productId) || 'Product',
    hotel: hotels.get(inventory.hotelId) || 'Hotel',
    stock: inventory.quantity,
  }));

  const recentPayments = paidPayments.slice(0, 4).map((payment) => ({
    hotel: hotels.get(payment.hotelId) || 'Hotel',
    amount: formatCurrency(payment.amount),
    status: paymentStatusFromDb(payment.status),
  }));

  res.json({
    metrics: [
      { title: 'Total Products', value: data.products.length },
      { title: 'Hotels Served', value: data.users.filter((user) => user.role === 'HOTEL').length },
      { title: 'Low Stock Alerts', value: lowInventory.length, trend: `${Math.max(1, lowInventory.length - 4)} critical` },
      { title: 'Revenue (Month)', value: '₱186K', trend: '↑ 8.2%', trendUp: true },
    ],
    chartData: salesData,
    lowStockItems,
    recentPayments,
  });
}

export async function getSalesReports(_req: Request, res: Response) {
  const monthlySales = [
    { month: 'Jan', sales: 42000 },
    { month: 'Feb', sales: 38000 },
    { month: 'Mar', sales: 51000 },
    { month: 'Apr', sales: 46000 },
    { month: 'May', sales: 58000 },
    { month: 'Jun', sales: 62000 },
  ];

  const dailySales = [
    { day: 'Mon', sales: 3200 },
    { day: 'Tue', sales: 2800 },
    { day: 'Wed', sales: 4100 },
    { day: 'Thu', sales: 3600 },
    { day: 'Fri', sales: 5200 },
    { day: 'Sat', sales: 6100 },
    { day: 'Sun', sales: 4800 },
  ];

  const categoryData = [
    { name: 'Toiletries', value: 45 },
    { name: 'Linens', value: 25 },
    { name: 'Amenities', value: 20 },
    { name: 'Other', value: 10 },
  ];

  res.json({
    monthlySales,
    dailySales,
    categoryData,
    summary: [
      { label: 'Total Sales (This Month)', value: '₱62,000' },
      { label: 'Average Daily Sales', value: '₱4,257' },
      { label: 'Best Selling Product', value: 'Bath Soap Set' },
      { label: 'Top Hotel', value: 'Grand Plaza Hotel' },
      { label: 'Growth vs Last Month', value: '+8.2%' },
    ],
  });
}

export async function getProductPerformance(_req: Request, res: Response) {
  res.json({
    performanceData: [
      { product: 'Shampoo', sales: 820, returns: 12, rating: 4.5 },
      { product: 'Soap Set', sales: 1450, returns: 25, rating: 4.8 },
      { product: 'Towels', sales: 340, returns: 5, rating: 4.2 },
      { product: 'Shower Gel', sales: 690, returns: 8, rating: 4.6 },
      { product: 'Dental Kit', sales: 520, returns: 15, rating: 3.9 },
      { product: 'Lotion', sales: 410, returns: 10, rating: 4.3 },
      { product: 'Slippers', sales: 380, returns: 3, rating: 4.7 },
      { product: 'Conditioner', sales: 290, returns: 7, rating: 4.1 },
    ],
  });
}

export async function getSalesMonitoring(_req: Request, res: Response) {
  res.json({
    metrics: [
      { title: 'Total Revenue', value: '₱1.24M', trend: '↑ 15.3% vs last month', trendUp: true },
      { title: 'Total Transactions', value: '2,847', trend: '↑ 230 this week', trendUp: true },
      { title: 'Active Hotels', value: 12 },
      { title: 'Avg. Order Value', value: '₱435', trend: '↑ 3.2%', trendUp: true },
    ],
    hotelSalesData: [
      { hotel: 'Grand Plaza', sales: 125000 },
      { hotel: 'Seaside', sales: 98000 },
      { hotel: 'Mountain View', sales: 76000 },
      { hotel: 'City Center', sales: 112000 },
      { hotel: 'Bayfront', sales: 54000 },
    ],
  });
}

export async function getComplianceReport(_req: Request, res: Response) {
  res.json({
    complianceData: [
      { supplier: 'CleanCo Supplies', hotel: 'Grand Plaza Hotel', amount: '₱125,000', dueDate: 'Mar 15, 2026', paidDate: 'Mar 14, 2026', status: 'paid' },
      { supplier: 'TextilePro Inc.', hotel: 'Seaside Resort', amount: '₱78,500', dueDate: 'Mar 20, 2026', paidDate: '—', status: 'pending' },
      { supplier: 'HotelEssentials', hotel: 'Mountain View Inn', amount: '₱45,200', dueDate: 'Mar 10, 2026', paidDate: '—', status: 'overdue' },
      { supplier: 'CleanCo Supplies', hotel: 'City Center Hotel', amount: '₱92,300', dueDate: 'Mar 18, 2026', paidDate: 'Mar 17, 2026', status: 'paid' },
      { supplier: 'TextilePro Inc.', hotel: 'Grand Plaza Hotel', amount: '₱63,700', dueDate: 'Mar 22, 2026', paidDate: '—', status: 'pending' },
      { supplier: 'CleanCo Supplies', hotel: 'Bayfront Hotel', amount: '₱38,900', dueDate: 'Mar 5, 2026', paidDate: '—', status: 'overdue' },
    ],
  });
}
