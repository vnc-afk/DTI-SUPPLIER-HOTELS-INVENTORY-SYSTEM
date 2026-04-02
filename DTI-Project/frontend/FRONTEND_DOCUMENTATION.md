# 📋 Frontend Documentation - DTI Supplier Hotels Inventory System

## 🗂️ Project Structure Overview

This Next.js 13+ application implements a **role-based, feature-driven inventory management system** with separate portals for Suppliers, Hotels, and DTI Admins. The architecture follows modern React patterns with TypeScript, Tailwind CSS, and a comprehensive UI component library.

---

## 📁 Directory Structure & Purposes

### **1. `src/app/` - Pages & Routes (Next.js App Router)**

**Purpose:** Contains all page components organized by route using Next.js 13+ App Router structure.

#### Root Files:
- **`layout.tsx`** - Root layout wrapper; sets up metadata, fonts, providers, and global styles for entire application
- **`page.tsx`** - Home/landing page; typically the login/role selection interface
- **`providers.tsx`** - Wraps the entire app with context providers (RoleProvider, theme providers, toast notifications)

#### Route Pages (Feature-based):
| Route | File | Purpose |
|-------|------|---------|
| `/dashboard` | `dashboard/page.tsx` | Main dashboard with role-specific overview |
| `/users` | `users/page.tsx` | User management (Admin only) |
| `/products` | `products/page.tsx` | Product catalog & inventory browsing |
| `/alerts` | `alerts/page.tsx` | Low-stock & system alerts notifications |
| `/audit-logs` | `audit-logs/page.tsx` | Activity & compliance audit trail |
| `/consignment` | `consignment/page.tsx` | Hotel consignment tracking |
| `/hotel-inventory` | `hotel-inventory/page.tsx` | Hotel-specific inventory view |
| `/payment-compliance` | `payment-compliance/page.tsx` | Payment compliance & monitoring (Admin) |
| `/payments` | `payments/page.tsx` | Payment transactions & management |
| `/product-performance` | `product-performance/page.tsx` | Product analytics & KPIs (Admin) |
| `/record-sale` | `record-sale/page.tsx` | Sale transaction recording interface |
| `/sales-monitoring` | `sales-monitoring/page.tsx` | Real-time sales monitoring (Admin) |
| `/sales-reports` | `sales-reports/page.tsx` | Sales analytics & export reports |

---

### **2. `src/components/` - Reusable UI Components**

**Purpose:** Centralized component library organized by classification.

#### **Root Files:**
- **`NavLink.tsx`** - Wrapper component for navigation links with active state styling

#### **`layout/` Subdirectory - Layout Components:**
Provides structural components for page layouts and role-based rendering.

| Component | Purpose |
|-----------|---------|
| **AppSidebar.tsx** | Main navigation sidebar; displays role-specific menu items with user info & sign-out button |
| **DashboardLayout.tsx** | Layout wrapper for authenticated dashboard pages; includes AppSidebar, header, and main content area |
| **RoleGate.tsx** | Access control wrapper; restricts components to specific user roles; redirects unauthorized users |

**RoleGate Usage Example:**
```tsx
<RoleGate allowedRoles={['admin']} fallbackPath="/dashboard">
  <AdminPanel />
</RoleGate>
```

#### **`ui/` Subdirectory - Design System Components (47 UI Primitives)**

Shadcn/ui-based design system providing consistent, accessible UI components.

**Input Components:**
- `input.tsx`, `textarea.tsx` - Text input fields
- `checkbox.tsx`, `radio-group.tsx`, `switch.tsx` - Selection controls
- `select.tsx`, `input-otp.tsx` - Dropdown & OTP inputs
- `slider.tsx`, `toggle.tsx`, `toggle-group.tsx` - Range & toggle controls

**Display & Feedback:**
- `card.tsx`, `badge.tsx`, `avatar.tsx` - Container & display elements
- `alert.tsx`, `alert-dialog.tsx` - Alert notifications
- `progress.tsx`, `skeleton.tsx` - Loading & progress indicators
- `stat-card.tsx`, `status-badge.tsx` - Custom status displays
- `toast.tsx`, `toaster.tsx`, `sonner.tsx` - Toast notifications

**Navigation & Menus:**
- `button.tsx`, `navigation-menu.tsx`, `menubar.tsx` - Navigation controls
- `breadcrumb.tsx`, `pagination.tsx`, `tabs.tsx` - Navigation aids
- `dropdown-menu.tsx`, `context-menu.tsx` - Menu systems

**Containers & Overlays:**
- `dialog.tsx`, `drawer.tsx`, `sheet.tsx` - Modal containers
- `popover.tsx`, `hover-card.tsx` - Floating UI elements
- `accordion.tsx`, `collapsible.tsx` - Expandable sections
- `carousel.tsx` - Image/content carousel

**Data Display:**
- `table.tsx`, `command.tsx` - Data tables & command palettes
- `scroll-area.tsx` - Scrollable containers
- `chart.tsx` - Chart/graph components (Chart.js integration)

**Forms & Validation:**
- `form.tsx`, `form-context.ts` - Form state management
- `label.tsx`, `calendar.tsx` - Form-related components
- `validators.ts` - Form validation utilities

**Utilities:**
- `sidebar.tsx`, `sidebar-context.ts` - Sidebar state management
- `tooltip.tsx` - Tooltip overlays
- `separator.tsx`, `aspect-ratio.tsx` - Layout utilities
- `resizable.tsx` - Resizable containers
- `use-toast.ts` - Toast hook integration

---

### **3. `src/contexts/` - Global State Management**

**Purpose:** React Context providers for app-wide state management.

#### **RoleContext.tsx**
Manages user authentication state and role-based access control.

**Context Value:**
```typescript
{
  role: UserRole | null;              // 'supplier' | 'hotel' | 'admin'
  setRole: (role: UserRole | null) => void;  // Update role
  userName: string;                   // Display user/company name
  isHydrated: boolean;                // Hydration status for SSR
}
```

**Default User Names by Role:**
- `supplier` → "CleanCo Supplies"
- `hotel` → "Grand Plaza Hotel"
- `admin` → "DTI Compliance Desk"

**Features:**
- Persists role/username to localStorage (`dti-role`, `dti-user-name`)
- Hydration check for SSR compatibility
- Auto-sets user name based on selected role

**Usage:**
```tsx
const { role, setRole, userName, isHydrated } = useRole();
```

---

### **4. `src/hooks/` - Custom React Hooks**

**Purpose:** Reusable hooks encapsulating common logic patterns.

#### **Core Hooks:**

| Hook | Purpose | Returns |
|------|---------|---------|
| **`useAuth.ts`** | Authentication state management; handles login/logout/session | `{ user, login, logout, isLoading, error }` |
| **`useFetch.ts`** | Generic data fetching; manages loading/error/retry | `{ data, loading, error, refetch }` |
| **`useForm.ts`** | Form state management; handles values/validation/submission | `{ values, errors, touched, handleChange, handleSubmit }` |
| **`useLocalStorage.ts`** | Persist data to browser localStorage | `[value, setValue, isHydrated]` |
| **`use-toast.ts`** | Toast notification hook from Sonner library | `{ toast }` |
| **`use-mobile.tsx`** | Mobile/responsive breakpoint detection | `{ isMobile }` |

**Example - useLocalStorage:**
```tsx
const [role, setRole, isHydrated] = useLocalStorage('dti-role', null);
```

**Example - useFetch:**
```tsx
const { data: products, loading, error } = useFetch('/api/products');
```

---

### **5. `src/lib/` - Utility Functions & Constants**

**Purpose:** Shared utilities, constants, and helper functions used across the app.

#### **Files:**

| File | Purpose | Key Exports |
|------|---------|-------------|
| **`constants.ts`** | App-wide constants | `ROLES`, `ROLE_LABELS`, `ROLE_COLORS`, `API_BASE_URL`, `REQUEST_TIMEOUT` |
| **`validators.ts`** | Form validation utilities | `validateEmail()`, `validatePassword()`, `validatePhoneNumber()` |
| **`utils.ts`** | General utility functions | `cn()` (Tailwind class merger), `formatDate()`, `truncateString()` |
| **`format.ts`** | Data formatting helpers | `formatCurrency()`, `formatDate()`, `formatPhoneNumber()` |
| **`statusHelpers.ts`** | Status/badge formatting | `getStockStatusColor()`, `getProductStatusLabel()` |
| **`index.ts`** | Barrel export file | Exports all utilities |

**Example - constants:**
```typescript
export const ROLES = ['supplier', 'hotel', 'admin'] as const;
export const ROLE_COLORS = {
  supplier: 'bg-blue-100',
  hotel: 'bg-green-100',
  admin: 'bg-purple-100'
};
```

**Example - validators:**
```typescript
validateEmail('user@example.com'); // true/false
validatePassword('SecurePass123!'); // true/false
```

---

### **6. `src/services/` - API Communication Layer**

**Purpose:** Centralized service for backend API communication.

#### **`api.ts`**

**ApiService Class:**
A singleton service handling all HTTP requests to the backend API.

**Methods:**
- `get<T>(path: string)` - GET request
- `post<T>(path: string, data: any)` - POST request
- `put<T>(path: string, data: any)` - PUT request
- `delete<T>(path: string)` - DELETE request
- `patch<T>(path: string, data: any)` - PATCH request

**Features:**
- Automatic Bearer token authentication (from localStorage)
- Configurable request timeout (default: 10s)
- Centralized error handling
- TypeScript response typing

**Example:**
```tsx
const api = new ApiService();

// Fetch products
const products = await api.get<Product[]>('/api/products');

// Create product
const newProduct = await api.post<Product>('/api/products', {
  name: 'Product Name',
  price: 99.99
});
```

---

### **7. `src/types/` - TypeScript Type Definitions**

**Purpose:** Centralized TypeScript interfaces and types for type safety across the application.

#### **`index.ts`**

**Core Types:**

```typescript
// User & Auth
type UserRole = 'supplier' | 'hotel' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
}

// Products & Inventory
interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  reorderLevel: number;
  status: ProductStatus;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

type StockStatus = 'sufficient' | 'low' | 'critical' | 'out';
type ProductStatus = 'active' | 'inactive' | 'pending';

// Transactions
interface Sale {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  totalAmount: number;
  hotelId: string;
  recordedAt: Date;
  recordedBy: string;
}

// Consignment
interface Consignment {
  id: string;
  supplierId: string;
  hotelId: string;
  items: ConsignmentItem[];
  status: 'pending' | 'delivered' | 'received' | 'returned';
  createdAt: Date;
}
```

---

### **8. `src/styles/` - Global Styling**

**Purpose:** Global CSS, Tailwind configuration, and theme variables.

#### **`globals.css`**

**Contents:**
- Tailwind CSS imports (`@tailwind` directives)
- CSS custom properties (theme colors, shadows, spacing)
- Base element styles (typography, form elements)
- Custom animations (fade-in, slide-in, etc.)
- Component-specific overrides

**Example:**
```css
:root {
  --primary: 59 130 246;        /* Tailwind blue-500 */
  --secondary: 100 116 139;     /* Tailwind slate-500 */
  --destructive: 239 68 68;     /* Tailwind red-500 */
  --background: 255 255 255;    /* White */
  --foreground: 15 23 42;       /* Slate-900 */
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Tailwind Configuration:** Located in `tailwind.config.js`, integrates CSS variables and extends default theme.

---

## 🔄 Data Flow Architecture

```
┌─────────────────────┐
│  Pages (app/*)      │  ← User-facing routes
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Components (UI)    │  ← Reusable UI components
│  - layout/          │
│  - ui/              │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌──────────────┐
│ Hooks   │  │ Contexts     │
│ - State │  │ - RoleContext│
│ - Logic │  └──────────────┘
└────┬────┘
     │
     ▼
┌──────────────────┐
│ Services (API)   │  ← Backend communication
│ - api.ts         │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌─────────┐
│ Types  │ │   Lib   │  ← Utilities
│- /types│ │-/lib    │
└────────┘ └─────────┘
```

---

## 🔐 Role-Based Access Control (RBAC)

### **Three User Roles:**

#### **1. Supplier**
Portal for suppliers to manage products and consignments.
- **Access:** Dashboard, Products, Hotel Inventory, Low-Stock Alerts, Sales Reports, Payments
- **Features:** Add/edit products, manage stock, track sales, process payments

#### **2. Hotel**
Portal for hotel staff to manage consignments and record sales.
- **Access:** Dashboard, Consignment, Record Sale, Sales Reports, Payments
- **Features:** View consignments, record sales, track payments, view reports

#### **3. Admin**
System administrator with full access and compliance oversight.
- **Access:** All pages + Admin-only: Users & Suppliers, Sales Monitoring, Product Performance, Payment Compliance, Audit Logs
- **Features:** User management, system monitoring, compliance tracking, audit trails

### **Implementation:**
- Role stored in `RoleContext` via localStorage
- Pages protected with `DashboardLayout` (requires role)
- Routes protected with `RoleGate` component (specific role validation)
- Sidebar dynamically renders role-specific menu items via `navMap` in `AppSidebar`

---

## 📦 Dependencies & Integrations

### **Core Libraries:**
- **Next.js 13+** - React framework with App Router
- **React 18+** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library built on Radix UI

### **UI & Notifications:**
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Recharts** (or Chart.js) - Data visualization

### **Form & Validation:**
- **React Hook Form** - Form state management
- **Zod/Yup** - Schema validation

### **HTTP Client:**
- **Axios** or **Fetch API** - Backend communication (wrapped in `ApiService`)

---

## 🚀 Key Features & Patterns

### **1. Server-Side Rendering (SSR) Safety**
- Hydration checks via `isHydrated` flag from contexts and hooks
- `useLocalStorage` prevents hydration mismatch errors
- Components conditionally render after hydration complete

### **2. Type Safety**
- Full TypeScript coverage
- Centralized type definitions in `types/index.ts`
- API service methods return typed responses

### **3. Responsive Design**
- Tailwind CSS responsive utilities
- `use-mobile.tsx` hook for breakpoint detection
- Collapsible sidebar (`AppSidebar` with icon-only mode)

### **4. Authentication Flow**
- Role selection on login page (`page.tsx`)
- Role persisted to localStorage
- `DashboardLayout` redirects unauthenticated users to home
- `RoleGate` prevents unauthorized route access

### **5. State Management Strategy**
- **Global:** Role state via `RoleContext`
- **Local:** Form state via `useForm` hook
- **Persistent:** localStorage via `useLocalStorage` hook
- **API:** Server state via `useFetch` hook

---

## 📄 Configuration Files

| File | Purpose |
|------|---------|
| **`next.config.ts`** | Next.js configuration (build settings, redirects) |
| **`tsconfig.json`** | TypeScript configuration; includes path aliases (`@/*`) |
| **`tailwind.config.js`** | Tailwind CSS customization (theme, plugins) |
| **`postcss.config.js`** | PostCSS configuration (Tailwind processing) |
| **`eslint.config.mjs`** | ESLint rules for code quality |
| **`package.json`** | Dependencies, scripts, project metadata |
| **`.next-env.d.ts`** | Generated Next.js types (do not edit) |

---

## 🎯 Quick Start Guide

### **Development Server:**
```bash
npm run dev
# App runs at http://localhost:3000
```

### **Production Build:**
```bash
npm run build
npm run start
```

### **Code Quality:**
```bash
npm run lint
npm run type-check
```

---

## 📋 File Naming Conventions

- **Pages:** `page.tsx` in route directory
- **Layouts:** `layout.tsx` + PascalCase suffixed components
- **Components:** PascalCase (e.g., `ProductCard.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Services:** camelCase (e.g., `api.ts`)
- **Types:** `index.ts` in types folder, PascalCase for interfaces
- **Utils:** camelCase in lib folder

---

## 🔗 Inter-Component Communication

### **Parent → Child:**
Props passing (standard React pattern)

### **Child → Parent (Sibling):**
Context (RoleContext), Custom Hooks (useAuth, useFetch)

### **Component ↔ Backend:**
ApiService class in `services/api.ts`

### **Global State:**
RoleContext for auth state, localStorage for persistence

---

## ✅ Best Practices Implemented

1. ✅ **Component Library** - Consistent UI via shadcn/ui
2. ✅ **Type Safety** - Full TypeScript coverage
3. ✅ **Separation of Concerns** - Clear layer organization
4. ✅ **DRY Principle** - Reusable components, hooks, utilities
5. ✅ **SEO Optimization** - Next.js metadata in layout
6. ✅ **Accessibility** - Radix UI accessible primitives
7. ✅ **Performance** - Code splitting via App Router
8. ✅ **Error Handling** - Centralized in ApiService
9. ✅ **Documentation** - Clear naming and organization
10. ✅ **Security** - Bearer token auth, role-based gates

---

## 🐛 Debugging Tips

### **Role State Issues:**
Check localStorage: `localStorage.getItem('dti-role')`

### **Hydration Errors:**
Ensure components wait for `isHydrated` before rendering

### **API Errors:**
Check browser DevTools Network tab, ApiService error logs

### **TypeScript Errors:**
Run `npm run type-check` for comprehensive type validation

### **Styling Issues:**
Use Tailwind DevTools, check `globals.css` for overrides

---

## 📞 Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **shadcn/ui:** https://ui.shadcn.com
- **TypeScript:** https://www.typescriptlang.org

---

**Last Updated:** April 2026  
**Framework Version:** Next.js 13+  
**UI Library:** shadcn/ui  
**Language:** TypeScript
