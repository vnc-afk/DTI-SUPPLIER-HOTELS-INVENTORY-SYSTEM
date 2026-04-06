import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { comparePasswords, generateToken, hashPassword, verifyToken } from '../utils/auth';
import { prisma } from '../config/db';
import {
  buildAlertDto,
  buildPaymentDto,
  buildProductDto,
  buildUserDto,
  createUserRecord,
  formatCurrency,
  getInventoryStock,
  loadBaseData,
  paymentStatusFromDb,
  roleFromDb,
  statusFromDb,
  demoProfiles,
} from './data';
import { publicProcedure, router } from './trpc';

const userRoleSchema = z.enum(['supplier', 'hotel', 'admin']);

async function findFirstHotelName(users: Array<{ id: string; company: string; role: string }>) {
  return users.find((user) => user.role === 'HOTEL')?.company || 'Grand Plaza Hotel';
}

export const appRouter = router({
  auth: router({
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1),
          name: z.string().min(1),
          role: userRoleSchema,
          company: z.string().min(1),
        }),
      )
      .mutation(async ({ input }) => {
        const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

        if (existingUser) {
          throw new TRPCError({ code: 'CONFLICT', message: 'User already exists' });
        }

        const user = await prisma.user.create({
          data: {
            email: input.email,
            password: await hashPassword(input.password),
            name: input.name,
            role: input.role.toUpperCase() as 'SUPPLIER' | 'HOTEL' | 'ADMIN',
            company: input.company,
          },
        });

        const token = generateToken({
          userId: user.id,
          email: user.email,
          role: user.role as 'SUPPLIER' | 'HOTEL' | 'ADMIN',
        });

        return {
          message: 'User registered successfully',
          user: buildUserDto(user),
          token,
        };
      }),
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1),
        }),
      )
      .mutation(async ({ input }) => {
        const user = await prisma.user.findUnique({ where: { email: input.email } });

        if (!user) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
        }

        const isPasswordValid = await comparePasswords(input.password, user.password);

        if (!isPasswordValid) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
        }

        const token = generateToken({
          userId: user.id,
          email: user.email,
          role: user.role as 'SUPPLIER' | 'HOTEL' | 'ADMIN',
        });

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'LOGIN',
            entity: 'User',
            entityId: user.id,
          },
        });

        return {
          message: 'Login successful',
          user: buildUserDto(user),
          token,
        };
      }),
    me: publicProcedure
      .input(
        z.object({
          token: z.string().min(1),
        }),
      )
      .query(async ({ input }) => {
        const payload = verifyToken(input.token);

        if (!payload) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { id: true, email: true, name: true, role: true, company: true, status: true, createdAt: true },
        });

        if (!user) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }

        return buildUserDto(user);
      }),
    logout: publicProcedure
      .input(
        z.object({
          token: z.string().optional(),
        }).optional(),
      )
      .mutation(async () => ({ success: true })),
  }),

  dashboard: router({
    get: publicProcedure
      .input(
        z.object({
          role: userRoleSchema,
        }),
      )
      .query(async ({ input }) => {
        const data = await loadBaseData();
        const products = new Map(data.products.map((product) => [product.id, product.name]));
        const usersMap = new Map(data.users.map((user) => [user.id, user.name]));
        const hotels = new Map(data.users.filter((user) => user.role === 'HOTEL').map((user) => [user.id, user.company]));
        const suppliers = new Map(data.users.filter((user) => user.role === 'SUPPLIER').map((user) => [user.id, user.company]));

        const paidPayments = data.payments.filter((payment) => payment.status === 'PAID');
        const lowInventory = data.inventories.filter((inventory) => inventory.quantity <= inventory.minThreshold);

        if (input.role === 'hotel') {
          const hotelName = await findFirstHotelName(data.users);
          const hotelUser = data.users.find((user) => user.company === hotelName);
          const consignmentItems = data.products.slice(0, 4).map((product, index) => ({
            name: product.name,
            supplier: index % 2 === 0 ? 'CleanCo Supplies' : 'TextilePro Inc.',
            qty: data.inventories.filter((inventory) => inventory.productId === product.id).reduce((sum, inventory) => sum + inventory.quantity, 0),
            price: formatCurrency(product.price),
          }));

          return {
            metrics: [
              { title: 'Products on Hand', value: 263 },
              { title: 'Sales Today', value: 18, trend: '↑ 5 from yesterday', trendUp: true },
              { title: 'Revenue (Week)', value: '₱28.5K', trend: '↑ 12%', trendUp: true },
              { title: 'Pending Payment', value: '₱45K', trend: 'Due in 5 days' },
            ],
            chartData: [
              { week: 'Week 1', sales: 1200 },
              { week: 'Week 2', sales: 1800 },
              { week: 'Week 3', sales: 1500 },
              { week: 'Week 4', sales: 2200 },
            ],
            items: consignmentItems,
            hotel: hotelUser?.company || hotelName,
          };
        }

        if (input.role === 'admin') {
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

          return {
            metrics: [
              { title: 'Total Users', value: data.users.length },
              { title: 'Active Suppliers', value: data.users.filter((user) => user.role === 'SUPPLIER' && user.status === 'ACTIVE').length },
              { title: 'Total Sales (Month)', value: '₱1.2M', trend: '↑ 15.3%', trendUp: true },
              { title: 'Compliance Rate', value: '92%', trend: '↑ 3%', trendUp: true },
            ],
            performanceData,
            recentActivity,
            compliance,
          };
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

        return {
          metrics: [
            { title: 'Total Products', value: data.products.length },
            { title: 'Hotels Served', value: data.users.filter((user) => user.role === 'HOTEL').length },
            { title: 'Low Stock Alerts', value: lowInventory.length, trend: `${Math.max(1, lowInventory.length - 4)} critical` },
            { title: 'Revenue (Month)', value: '₱186K', trend: '↑ 8.2%', trendUp: true },
          ],
          chartData: salesData,
          lowStockItems,
          recentPayments,
        };
      }),
  }),

  reports: router({
    sales: publicProcedure.query(async () => ({
      monthlySales: [
        { month: 'Jan', sales: 42000 },
        { month: 'Feb', sales: 38000 },
        { month: 'Mar', sales: 51000 },
        { month: 'Apr', sales: 46000 },
        { month: 'May', sales: 58000 },
        { month: 'Jun', sales: 62000 },
      ],
      dailySales: [
        { day: 'Mon', sales: 3200 },
        { day: 'Tue', sales: 2800 },
        { day: 'Wed', sales: 4100 },
        { day: 'Thu', sales: 3600 },
        { day: 'Fri', sales: 5200 },
        { day: 'Sat', sales: 6100 },
        { day: 'Sun', sales: 4800 },
      ],
      categoryData: [
        { name: 'Toiletries', value: 45 },
        { name: 'Linens', value: 25 },
        { name: 'Amenities', value: 20 },
        { name: 'Other', value: 10 },
      ],
      summary: [
        { label: 'Total Sales (This Month)', value: '₱62,000' },
        { label: 'Average Daily Sales', value: '₱4,257' },
        { label: 'Best Selling Product', value: 'Bath Soap Set' },
        { label: 'Top Hotel', value: 'Grand Plaza Hotel' },
        { label: 'Growth vs Last Month', value: '+8.2%' },
      ],
    })),
    performance: publicProcedure.query(async () => ({
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
    })),
    monitoring: publicProcedure.query(async () => ({
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
    })),
    compliance: publicProcedure.query(async () => ({
      complianceData: [
        { supplier: 'CleanCo Supplies', hotel: 'Grand Plaza Hotel', amount: '₱125,000', dueDate: 'Mar 15, 2026', paidDate: 'Mar 14, 2026', status: 'paid' },
        { supplier: 'TextilePro Inc.', hotel: 'Seaside Resort', amount: '₱78,500', dueDate: 'Mar 20, 2026', paidDate: '—', status: 'pending' },
        { supplier: 'HotelEssentials', hotel: 'Mountain View Inn', amount: '₱45,200', dueDate: 'Mar 10, 2026', paidDate: '—', status: 'overdue' },
        { supplier: 'CleanCo Supplies', hotel: 'City Center Hotel', amount: '₱92,300', dueDate: 'Mar 18, 2026', paidDate: 'Mar 17, 2026', status: 'paid' },
        { supplier: 'TextilePro Inc.', hotel: 'Grand Plaza Hotel', amount: '₱63,700', dueDate: 'Mar 22, 2026', paidDate: '—', status: 'pending' },
        { supplier: 'CleanCo Supplies', hotel: 'Bayfront Hotel', amount: '₱38,900', dueDate: 'Mar 5, 2026', paidDate: '—', status: 'overdue' },
      ],
    })),
  }),

  alerts: router({
    list: publicProcedure.query(async () => {
      const data = await loadBaseData();
      const products = new Map(data.products.map((product) => [product.id, product.name]));
      const hotels = new Map(data.users.filter((user) => user.role === 'HOTEL').map((user) => [user.id, user.company]));

      return data.inventories
        .map((inventory) => buildAlertDto({
          id: `${inventory.hotelId}-${inventory.productId}`,
          productName: products.get(inventory.productId) || 'Product',
          hotelName: hotels.get(inventory.hotelId) || 'Hotel',
          currentStock: inventory.quantity,
          minStock: inventory.minThreshold,
          createdAt: inventory.updatedAt.toISOString(),
        }))
        .filter((alert) => alert.currentStock <= alert.minStock)
        .slice(0, 12);
    }),
  }),

  auditLogs: router({
    list: publicProcedure
      .input(
        z.object({
          search: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        const data = await loadBaseData();
        const users = new Map(data.users.map((user) => [user.id, user.name]));
        const search = input.search?.toLowerCase() || '';

        return data.auditLogs
          .map((log) => ({
            id: log.id,
            timestamp: log.createdAt.toISOString().replace('T', ' ').slice(0, 19),
            user: users.get(log.userId) || 'System',
            action: log.entity === 'Payment' ? 'Submitted payment' : log.entity === 'Sale' ? 'Recorded sale' : `${log.action}`,
            details: typeof log.changes === 'object' && log.changes && 'details' in log.changes ? String((log.changes as { details?: string }).details) : `${log.entity} update`,
            type: log.entity === 'Payment' ? 'payment' : log.entity === 'Sale' ? 'sale' : log.entity === 'User' ? 'admin' : log.entity === 'Alert' ? 'alert' : 'system',
          }))
          .filter((log) => !search || log.user.toLowerCase().includes(search) || log.action.toLowerCase().includes(search) || log.details.toLowerCase().includes(search));
      }),
  }),

  users: router({
    list: publicProcedure
      .input(
        z.object({
          search: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        const data = await loadBaseData();
        const search = input.search?.toLowerCase() || '';

        return data.users
          .map((user) => buildUserDto(user))
          .filter((user) => !search || user.name.toLowerCase().includes(search) || user.company.toLowerCase().includes(search));
      }),
    create: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().min(1),
          role: userRoleSchema,
          company: z.string().min(1),
          password: z.string().min(1).default('Password123!'),
        }),
      )
      .mutation(async ({ input }) => {
        const existing = await prisma.user.findUnique({ where: { email: input.email } });

        if (existing) {
          throw new TRPCError({ code: 'CONFLICT', message: 'User already exists' });
        }

        const created = await createUserRecord(input);
        return buildUserDto(created);
      }),
    toggleStatus: publicProcedure
      .input(
        z.object({
          id: z.string().min(1),
        }),
      )
      .mutation(async ({ input }) => {
        const user = await prisma.user.findUnique({ where: { id: input.id } });

        if (!user) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }

        const updated = await prisma.user.update({
          where: { id: input.id },
          data: { status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' },
        });

        return buildUserDto(updated);
      }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      const data = await loadBaseData();
      const supplierName = 'CleanCo Supplies';

      return data.products.map((product) => buildProductDto(product, getInventoryStock(data.inventories, product.id), supplierName));
    }),
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          price: z.number(),
        }),
      )
      .mutation(async ({ input }) => {
        const created = await prisma.product.create({
          data: {
            name: input.name,
            description: input.description || null,
            price: input.price,
            status: 'ACTIVE',
          },
        });

        return created;
      }),
  }),

  consignments: router({
    list: publicProcedure.query(async () => {
      const data = await loadBaseData();
      const products = new Map(data.products.map((product) => [product.id, product.name]));
      const hotels = new Map(data.users.filter((user) => user.role === 'HOTEL').map((user) => [user.id, user.company]));

      const rows = await prisma.consignment.findMany({ include: { items: true } });

      return rows.flatMap((consignment) => consignment.items.map((item) => {
        const productName = products.get(item.productId) || 'Product';
        const hotelName = hotels.get(consignment.hotelId) || 'Hotel';
        const unitPrice = demoProfiles.products.find((product: typeof demoProfiles.products[number]) => product.name === productName)?.price || 0;

        return {
          id: item.id,
          productId: item.productId,
          productName,
          productImage: '📦',
          hotelId: consignment.hotelId,
          hotelName,
          quantity: item.quantity,
          unitPrice,
          soldQuantity: 0,
          remainingQuantity: item.quantity,
          lastUpdated: consignment.updatedAt.toISOString(),
        };
      }));
    }),
  }),

  sales: router({
    recent: publicProcedure.query(async () => {
      const data = await loadBaseData();
      const products = new Map(data.products.map((product) => [product.id, product.name]));
      const hotels = new Map(data.users.filter((user) => user.role === 'HOTEL').map((user) => [user.id, user.company]));

      return data.sales.slice(0, 5).map((sale) => ({
        id: sale.id,
        product: sale.productId ? products.get(sale.productId) || 'Product' : 'Product',
        hotel: hotels.get(sale.hotelId) || 'Hotel',
        qty: sale.quantity,
        total: formatCurrency(sale.totalAmount),
        time: sale.recordedAt.toISOString(),
      }));
    }),
    create: publicProcedure
      .input(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().int().positive(),
          hotelId: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const product = await prisma.product.findUnique({ where: { id: input.productId } });

        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }

        const hotel = input.hotelId
          ? await prisma.user.findUnique({ where: { id: input.hotelId } })
          : await prisma.user.findFirst({ where: { role: 'HOTEL' }, orderBy: { createdAt: 'asc' } });

        const created = await prisma.sale.create({
          data: {
            hotelId: hotel?.id || 'hotel-demo',
            productId: product.id,
            quantity: input.quantity,
            totalAmount: product.price * input.quantity,
            recordedAt: new Date(),
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: hotel?.id || (await prisma.user.findFirst({ where: { role: 'ADMIN' } }))?.id || 'user-demo',
            action: 'SALE_RECORDED',
            entity: 'Sale',
            entityId: created.id,
            changes: { productId: product.id, quantity: input.quantity },
          },
        });

        return {
          id: created.id,
          product: product.name,
          qty: created.quantity,
          total: formatCurrency(created.totalAmount),
          time: created.recordedAt.toISOString(),
        };
      }),
  }),

  payments: router({
    list: publicProcedure.query(async () => {
      const data = await loadBaseData();
      const hotels = new Map(data.users.filter((user) => user.role === 'HOTEL').map((user) => [user.id, user.company]));
      const suppliers = new Map(data.users.filter((user) => user.role === 'SUPPLIER').map((user) => [user.id, user.company]));

      return data.payments.map((payment) => buildPaymentDto(payment, hotels.get(payment.hotelId) || 'Hotel', suppliers.get(payment.supplierId) || 'Supplier'));
    }),
    submit: publicProcedure
      .input(
        z.object({
          supplierName: z.string().min(1),
          hotelName: z.string().min(1),
          amount: z.number(),
          referenceNumber: z.string().optional(),
          paymentDate: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const supplier = await prisma.user.findFirst({ where: { company: input.supplierName, role: 'SUPPLIER' } });
        const hotel = await prisma.user.findFirst({ where: { company: input.hotelName, role: 'HOTEL' } });

        const created = await prisma.payment.create({
          data: {
            invoiceNumber: input.referenceNumber || `INV-${Date.now()}`,
            supplierId: supplier?.id || (await prisma.user.findFirst({ where: { role: 'SUPPLIER' } }))?.id || 'supplier-demo',
            hotelId: hotel?.id || (await prisma.user.findFirst({ where: { role: 'HOTEL' } }))?.id || 'hotel-demo',
            amount: input.amount,
            status: 'PENDING',
            dueDate: input.paymentDate ? new Date(input.paymentDate) : new Date(),
            paidDate: null,
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: hotel?.id || (await prisma.user.findFirst({ where: { role: 'ADMIN' } }))?.id || 'user-demo',
            action: 'PAYMENT_PROCESSED',
            entity: 'Payment',
            entityId: created.id,
            changes: { referenceNumber: input.referenceNumber },
          },
        });

        return buildPaymentDto(created, hotel?.company || input.hotelName, supplier?.company || input.supplierName);
      }),
  }),
});

export type AppRouter = typeof appRouter;
