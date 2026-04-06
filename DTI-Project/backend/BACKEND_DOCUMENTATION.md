# 📋 Backend Documentation - DTI Supplier Hotels Inventory System

## 🗂️ Project Structure Overview

This Express/tRPC backend implements a **role-based inventory management system** with PostgreSQL database and comprehensive audit logging. The architecture uses modern Node.js patterns with TypeScript, Prisma ORM, and tRPC for type-safe RPC communication.

---

## 📁 Directory Structure & Purposes

### **1. `src/` - Application Source Code**

```
src/
├── index.ts            # App entry point
├── server.ts           # HTTP server setup
├── config/
│   └── db.ts          # Prisma client initialization
├── trpc/               # 🔴 PRIMARY - tRPC API Implementation
│   ├── trpc.ts        # tRPC initialization & context setup
│   ├── router.ts      # All API endpoints (9 routers, 20+ procedures)
│   └── data.ts        # Data fetching & DTO transformation utilities
├── utils/              # Shared utilities
│   ├── auth.ts        # Password hashing, JWT generation/validation
│   └── logger.ts      # Structured logging (info, error, warn)
├── data/               # Database management
│   └── demoSeed.ts    # Demo data initialization (runs on startup)
├── generated/          # 🟡 AUTO-GENERATED - Do NOT edit
│   └── prisma/        # Prisma client & types (auto-generated)
│
├── controllers/        # ⚪ LEGACY - Empty/Unused (can be deleted)
│   └── userController.ts
├── models/             # ⚪ LEGACY - Empty/Unused (can be deleted)
│   └── userModel.ts
├── middlewares/        # ⚪ LEGACY - Empty folder (can be deleted)
└── routes/             # ⚪ LEGACY - Empty/Unused (can be deleted)
    └── users.ts
```

**Legend:**
- 🔴 **RED (Active)** - Core implementation, actively used
- 🟡 **YELLOW (Generated)** - Auto-created, re-generated on schema changes
- ⚪ **WHITE (Legacy)** - Historical Express MVC pattern, not used, safe to delete

---

## 🔌 Configuration Files

### **`src/config/db.ts` - Database Connection**

Connects to PostgreSQL using Prisma Client with edge adapter support.

```typescript
// Uses:
// - DATABASE_URL env variable (PostgreSQL connection string)
// - PrismaPg adapter for optimal performance
// - Automatic cleanup on process shutdown
```

**Environment Variables Required:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dti_inventory
```

---

## 📡 tRPC API Architecture

### **`src/trpc/trpc.ts` - tRPC Setup**

Initializes the tRPC server with:
- **context**: Empty context for public access (can be extended for auth)
- **router**: Router factory for defining procedures
- **publicProcedure**: Public RPC procedure template

```typescript
export type Context = Record<string, never>;
export const router = t.router;
export const publicProcedure = t.procedure;
```

### **`src/trpc/router.ts` - Complete API Definition**

Defines all 9 routers with queries (reads) and mutations (writes).

**Router Structure:**
```
appRouter
├── auth
├── dashboard
├── reports
├── alerts
├── auditLogs
├── users
├── products
├── consignments
├── sales
└── payments
```

---

## 📊 API Endpoints Reference

### **1. Authentication Router `auth`**

#### **`register` (Mutation)**
Creates a new user account.

**Input:**
```typescript
{
  email: string;        // User email (must be unique)
  password: string;     // Plain password (hashed on server)
  name: string;         // Full name
  role: 'supplier' | 'hotel' | 'admin';
  company: string;      // Supplier/Hotel name
}
```

**Output:**
```typescript
{
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    company: string;
    status: string;
  };
  token: string;        // JWT token
}
```

**Error Cases:**
- `CONFLICT`: User with email already exists

---

#### **`login` (Mutation)**
Authenticates user and returns JWT token.

**Input:**
```typescript
{
  email: string;
  password: string;
}
```

**Output:**
```typescript
{
  user: { /* user object */ };
  token: string;        // JWT token
}
```

**Error Cases:**
- `UNAUTHORIZED`: Invalid email or password

---

#### **`me` (Query)**
Validates token and returns current user.

**Input:**
```typescript
{
  token: string;
}
```

**Output:**
```typescript
{
  user: { /* user object */ };
}
```

---

### **2. Dashboard Router `dashboard`**

#### **`get` (Query)**
Gets role-specific dashboard metrics and data.

**Input:**
```typescript
{
  role: 'supplier' | 'hotel' | 'admin';
}
```

**Output (Supplier):**
```typescript
{
  metrics: [
    { title: string; value: string | number; trend?: string; trendUp?: boolean }
  ];
  chartData: { month: string; sales: number }[];
  lowStockItems: { product: string; hotel: string; stock: number }[];
  recentPayments: { hotel: string; amount: string; status: string }[];
}
```

**Output (Hotel):**
```typescript
{
  metrics: { title: string; value: number | string }[];
  performanceData: Array<{ product: string; quantity: number }>;
  recentActivity: Array<{ item: string; change: string; timestamp: string }>;
  compliance: { hotel: string; supplier: string; amount: string; status: string }[];
}
```

**Output (Admin):**
```typescript
{
  metrics: { title: string; value: string | number }[];
  performanceData: Array<{ product: string; quantity: number }>;
  recentActivity: Array<{ item: string; change: string; timestamp: string }>;
  compliance: { hotel: string; supplier: string; amount: string; status: string }[];
}
```

---

### **3. Reports Router `reports`**

#### **`sales` (Query)**
Monthly and daily sales analytics.

**Output:**
```typescript
{
  monthlySales: { month: string; sales: number }[];
  dailySales: { day: string; sales: number }[];
  categoryData: { name: string; value: number }[];
  summary: { label: string; value: string }[];
}
```

---

#### **`performance` (Query)**
Product performance metrics.

**Output:**
```typescript
{
  performanceData: [
    {
      product: string;
      sales: number;
      returns: number;
      rating: number;
    }
  ];
}
```

---

#### **`monitoring` (Query)**
Real-time sales monitoring for admins.

**Output:**
```typescript
{
  metrics: { title: string; value: string | number; trend: string; trendUp: boolean }[];
  hotelSalesData: { hotel: string; sales: number }[];
}
```

---

#### **`compliance` (Query)**
Payment compliance tracking.

**Output:**
```typescript
{
  complianceData: [
    {
      supplier: string;
      hotel: string;
      amount: string;
      dueDate: string;
      paidDate: string;
      status: 'paid' | 'pending' | 'overdue';
    }
  ];
}
```

---

### **4. Alerts Router `alerts`**

#### **`list` (Query)**
Low-stock inventory alerts.

**Output:**
```typescript
[
  {
    id: string;
    productName: string;
    hotelName: string;
    currentStock: number;
    minStock: number;
    severity: 'low' | 'critical';
    createdAt: string; // ISO timestamp
  }
]
```

---

### **5. Audit Logs Router `auditLogs`**

#### **`list` (Query)**
Compliance audit trail with optional search.

**Input:**
```typescript
{
  search?: string;  // Search by user, action, or details
}
```

**Output:**
```typescript
[
  {
    id: string;
    timestamp: string;        // Format: "YYYY-MM-DD HH:MM:SS"
    user: string;            // User name
    action: string;          // 'Submitted payment', 'Recorded sale', etc.
    details: string;         // Change description
    type: 'payment' | 'sale' | 'admin' | 'alert' | 'system';
  }
]
```

---

### **6. Users Router `users`**

#### **`list` (Query)**
List all users with optional search.

**Input:**
```typescript
{
  search?: string;  // Search by name or company
}
```

**Output:**
```typescript
[
  {
    id: string;
    email: string;
    name: string;
    role: 'SUPPLIER' | 'HOTEL' | 'ADMIN';
    company: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
  }
]
```

---

#### **`create` (Mutation)**
Create new user (Admin only).

**Input:**
```typescript
{
  email: string;
  name: string;
  role: 'supplier' | 'hotel' | 'admin';
  company: string;
  password?: string;  // Defaults to 'Password123!'
}
```

**Output:**
```typescript
{
  id: string;
  email: string;
  name: string;
  role: string;
  company: string;
  status: string;
  createdAt: string;
}
```

---

#### **`toggleStatus` (Mutation)**
Enable/disable user account.

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  id: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  /* ...other user fields */
}
```

---

### **7. Products Router `products`**

#### **`list` (Query)**
All products with inventory status.

**Output:**
```typescript
[
  {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    supplier: string;
    createdAt: string;
  }
]
```

---

#### **`create` (Mutation)**
Create new product.

**Input:**
```typescript
{
  name: string;
  description?: string;
  price: number;
}
```

**Output:**
```typescript
{
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
```

---

### **8. Consignments Router `consignments`**

#### **`list` (Query)**
All consignment items across hotels.

**Output:**
```typescript
[
  {
    id: string;
    productId: string;
    productName: string;
    productImage: string;  // Emoji or URL
    hotelId: string;
    hotelName: string;
    quantity: number;
    unitPrice: number;
    soldQuantity: number;
    remainingQuantity: number;
    lastUpdated: string;   // ISO timestamp
  }
]
```

---

### **9. Sales Router `sales`**

#### **`recent` (Query)**
Last 5 recorded sales.

**Output:**
```typescript
[
  {
    id: string;
    product: string;
    hotel: string;
    qty: number;
    total: string;        // Formatted currency
    time: string;         // ISO timestamp
  }
]
```

---

#### **`create` (Mutation)**
Record new sale transaction.

**Input:**
```typescript
{
  productId: string;
  quantity: number;      // Must be positive integer
  hotelId?: string;      // Optional; uses first hotel if not provided
}
```

**Output:**
```typescript
{
  id: string;
  product: string;
  qty: number;
  total: string;         // Formatted currency
  time: string;          // ISO timestamp
}
```

**Behavior:**
- Creates audit log entry automatically
- Calculates `totalAmount` as `product.price * quantity`
- Sets `recordedAt` to current timestamp

---

### **10. Payments Router `payments`**

#### **`list` (Query)**
All payment transactions.

**Output:**
```typescript
[
  {
    id: string;
    invoiceNumber: string;
    supplier: string;
    hotel: string;
    amount: string;       // Formatted currency
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    dueDate: string;
    paidDate: string | null;
    createdAt: string;
  }
]
```

---

#### **`submit` (Mutation)**
Record new payment.

**Input:**
```typescript
{
  supplierName: string;
  hotelName: string;
  amount: number;
  referenceNumber?: string;   // Generated if not provided
  paymentDate?: string;       // ISO date string
}
```

**Output:**
```typescript
{
  id: string;
  invoiceNumber: string;
  supplier: string;
  hotel: string;
  amount: string;
  status: string;
  dueDate: string;
  paidDate: string | null;
  createdAt: string;
}
```

**Behavior:**
- Generates invoice number if `referenceNumber` not provided
- Creates audit log entry automatically
- Default status is 'PENDING'

---

## 💾 Database Schema (Prisma Models)

### **User Model**
```prisma
model User {
  id        String      @id @default(cuid())
  email     String      @unique
  password  String
  name      String
  role      UserRole    // SUPPLIER | HOTEL | ADMIN
  company   String
  status    UserStatus  // ACTIVE | INACTIVE
  
  // Relations
  salesRecords  Sale[]
  supplierPayments Payment[] @relation("SupplierPayments")
  hotelPayments    Payment[] @relation("HotelPayments")
  auditLogs     AuditLog[]
  consignments  Consignment[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### **Product Model**
```prisma
model Product {
  id        String         @id @default(cuid())
  name      String
  description String?
  price     Float
  status    ProductStatus  // ACTIVE | INACTIVE | PENDING
  
  // Relations
  consignmentItems ConsignmentItem[]
  hotelInventory HotelInventory[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### **HotelInventory Model**
Tracks product quantities at each hotel with low-stock alerts.

```prisma
model HotelInventory {
  id        String    @id @default(cuid())
  hotelId   String    // User ID of hotel
  productId String
  quantity  Int
  minThreshold Int   @default(10)
  
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([hotelId, productId])
}
```

---

### **Sale Model**
```prisma
model Sale {
  id        String    @id @default(cuid())
  hotelId   String    // User ID of hotel recording sale
  productId String?
  quantity  Int
  totalAmount Float
  recordedAt DateTime @default(now())
  
  hotel User @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
}
```

---

### **Payment Model**
```prisma
model Payment {
  id        String         @id @default(cuid())
  invoiceNumber String     @unique
  supplierId String        // User ID of supplier
  hotelId   String         // User ID of hotel
  amount    Float
  status    PaymentStatus  // PAID | PENDING | OVERDUE
  dueDate   DateTime
  paidDate  DateTime?
  
  supplier  User  @relation("SupplierPayments", fields: [supplierId], references: [id], onDelete: Cascade)
  hotel     User  @relation("HotelPayments", fields: [hotelId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### **Consignment Model**
```prisma
model Consignment {
  id        String               @id @default(cuid())
  supplierId String              // User ID
  hotelId   String              // User ID
  status    ConsignmentStatus   // ACTIVE | COMPLETED | CANCELLED
  
  supplier  User      @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  items     ConsignmentItem[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ConsignmentItem {
  id            String    @id @default(cuid())
  consignmentId String
  productId     String
  quantity      Int
  
  consignment   Consignment @relation(fields: [consignmentId], references: [id], onDelete: Cascade)
  product       Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([consignmentId, productId])
}
```

---

### **AuditLog Model**
Compliance tracking for all critical actions.

```prisma
model AuditLog {
  id        String      @id @default(cuid())
  userId    String
  action    AuditAction // CREATE | UPDATE | DELETE | LOGIN | SALE_RECORDED | PAYMENT_PROCESSED
  entity    String      // e.g., "Sale", "Payment", "User"
  entityId  String?
  changes   Json?       // JSON object tracking what changed
  
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
}
```

---

## 🔐 Authentication & Authorization

### **Token-Based Authentication**

Generated JWT tokens contain:
```json
{
  "userId": "string",
  "email": "string",
  "role": "SUPPLIER | HOTEL | ADMIN"
}
```

### **Authorization Strategy**

Currently, all tRPC procedures are public (`publicProcedure`). To enforce role-based access:

```typescript
// Example: Admin-only procedure
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  // Verify token and check role
  if (ctx.role !== 'ADMIN') {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next();
});
```

---

## 📁 Utility Functions (`src/utils/`)

### **`auth.ts`**
- `hashPassword(password: string): Promise<string>` - Hash password with bcrypt
- `comparePasswords(plain: string, hashed: string): Promise<boolean>` - Verify password
- `generateToken(payload: TokenPayload): string` - Create JWT token
- `verifyToken(token: string): TokenPayload | null` - Validate JWT token

### **`logger.ts`**
- `logger.info(message: string, data?: any)` - Log info level
- `logger.error(message: string, error?: any)` - Log error level
- `logger.warn(message: string, data?: any)` - Log warn level

---

## 🌱 Data Seeding (`src/data/demoSeed.ts`)

Initializes database with demo data on first startup:
- **Users**: Suppliers, Hotels, Admin
- **Products**: Sample inventory items
- **Consignments**: Demo consignment relations
- **Sales**: Sample transaction history
- **Payments**: Demo payment records

**Controlled by:** `ensureDemoData()` called in `server.ts`

---

## 🚀 Development Setup

### **1. Environment Configuration**

Create `.env` file:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dti_inventory

# Server
PORT=5000
NODE_ENV=development
```

### **2. Database Setup**

```bash
# Install dependencies
npm install

# Push Prisma schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed demo data (runs automatically on server start)
npm run dev
```

### **3. Running Development Server**

```bash
npm run dev
# Server runs at http://localhost:5000
# tRPC endpoint at http://localhost:5000/trpc/
```

### **4. Prisma Studio (Database Browser)**

```bash
npx prisma studio
# Opens browser UI at http://localhost:5555
```

---

## 🔄 Data Flow

```
Frontend (tRPC Client)
    ↓ [HTTP POST to /trpc/]
tRPC Router (router.ts)
    ↓ [Validates input with Zod]
Procedure Handler
    ↓ [Queries/Mutates data]
Prisma Client
    ↓ [ORM layer]
PostgreSQL Database
    ↓ [Stores/Retrieves data]
Response to Frontend
```

---

## 📊 Key Patterns

### **1. Data Transformation**

Helper functions in `trpc/data.ts` transform database models to DTOs:
- `buildUserDto(user)` - User response format
- `buildProductDto(product, stock, supplier)` - Product response format
- `buildPaymentDto(payment, hotel, supplier)` - Payment response format
- `buildAlertDto(data)` - Alert response format

### **2. Error Handling**

tRPC `TRPCError` with standardized codes:
```typescript
throw new TRPCError({ 
  code: 'CONFLICT',           // 409 Conflict
  message: 'User already exists' 
});

throw new TRPCError({ 
  code: 'UNAUTHORIZED',       // 401 Unauthorized
  message: 'Invalid credentials' 
});

throw new TRPCError({ 
  code: 'NOT_FOUND',          // 404 Not Found
  message: 'Product not found' 
});
```

### **3. Audit Logging**

Critical mutations automatically create audit logs:
```typescript
await prisma.auditLog.create({
  data: {
    userId: user.id,
    action: 'SALE_RECORDED',
    entity: 'Sale',
    entityId: sale.id,
    changes: { productId, quantity }
  }
});
```

---

## 🛠️ Troubleshooting

### **Issue: Prisma Client Generation Error**

**Solution:**
```bash
npx prisma generate
npx prisma format
```

### **Issue: DATABASE_URL Not Set**

**Solution:** Create `.env` file with:
```env
DATABASE_URL=postgresql://...
```

### **Issue: Server Won't Start on Port 5000**

**Solution:** Kill existing process or change PORT in `.env`

### **Issue: tRPC Endpoint Returns 404**

**Verify:**
- Server running on correct port
- Endpoint is `/trpc/` with trailing slash
- Frontend using correct `baseUrl` in tRPC client config

---

## 📝 File Naming Conventions

- **Routers:** Named after entity (e.g., `users`, `products`)
- **Procedures:** camelCase (e.g., `list`, `create`, `toggleStatus`)
- **Models:** PascalCase (e.g., `User`, `Product`, `Payment`)
- **Enums:** UPPERCASE (e.g., `UserRole`, `PaymentStatus`)
- **Utilities:** camelCase with descriptive names

---

## 🔗 Database Relationships

```
                    ┌─────────┐
                    │  User   │
                    │(SUPPLIER)
                    └────┬────┘
                         │
                    ┌────┴──────┐
                    ▼           ▼
            ┌──────────────┐  ┌──────────┐
            │Consignment  │  │ Payment  │
            │(supplier→)  │  │(supplier)│
            └──────┬───────┘  └──────────┘
                   │
                   ▼
            ┌──────────────┐
            │ConsignmentItem
            │(product→)
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │  Product     │
            └──────┬───────┘
                   │
            ┌──────┴──────┐
            ▼             ▼
    ┌──────────────┐ ┌──────────────┐
    │HotelInventory│ │ ConsignmentItem
    │(hotel→)      │ │
    └──────────────┘ └──────────────┘

User (HOTEL)
    ↓
Sale (hotel→)
    ↓
Product

User (HOTEL) ← Payment → User (SUPPLIER)
```

---

## ✅ Features

- ✅ **Role-Based Access** - Supplier, Hotel, Admin roles
- ✅ **Type-Safe RPC** - tRPC with full TypeScript
- ✅ **Password Security** - Bcrypt hashing
- ✅ **Audit Logging** - Track all critical actions
- ✅ **Data Validation** - Zod schema validation
- ✅ **Relational Data** - Prisma ORM with PostgreSQL
- ✅ **Demo Data** - Automatic seeding on startup
- ✅ **Error Handling** - Standardized tRPC errors
- ✅ **Database Migrations** - Version-controlled schema

---

## 🔗 Resources

- **tRPC Docs:** https://trpc.io
- **Prisma Docs:** https://prisma.io
- **PostgreSQL:** https://postgresql.org
- **Express.js:** https://expressjs.com
- **Node.js:** https://nodejs.org

---

**Last Updated:** April 2026  
**Runtime:** Node.js + Express  
**ORM:** Prisma  
**RPC:** tRPC  
**Database:** PostgreSQL  
**Language:** TypeScript
