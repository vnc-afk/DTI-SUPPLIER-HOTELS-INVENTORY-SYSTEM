# Utils & Hooks Guide

This guide explains how to use the utility functions and custom React hooks throughout your project.

## 📁 Structure

```
src/
├── utils/
│   ├── constants.ts        # App-wide constants and enums
│   ├── format.ts           # Formatting utilities (currency, dates, etc.)
│   ├── statusHelpers.ts    # Status color & label helpers
│   ├── validators.ts       # Form validation utilities
│   └── index.ts            # Export all utils
├── hooks/
│   ├── useAuth.ts          # Authentication state management
│   ├── useFetch.ts         # Data fetching hook
│   ├── useForm.ts          # Form state management
│   ├── useLocalStorage.ts  # localStorage wrapper
│   └── index.ts            # Export all hooks
└── services/
    └── api.ts              # Centralized API client
```

---

## 🛠️ Utils

### **constants.ts** — App Constants

```typescript
import { ROLES, STOCK_STATUS, API_ENDPOINTS } from '@/utils';

// Use role constants
if (userRole === ROLES.SUPPLIER) { ... }

// Access API endpoints
const url = API_ENDPOINTS.PRODUCTS; // '/api/products'
```

### **format.ts** — Formatting Functions

```typescript
import { formatCurrency, formatDate, toTitleCase } from '@/utils';

formatCurrency(1500)           // ₱1,500.00
formatDate('2026-03-31')       // Mar 31, 2026
formatDateTime('2026-03-31')   // Mar 31, 2026 - 09:14
truncate('Hello World', 8)     // Hello...
toTitleCase('hello_world')     // Hello World
percentage(30, 100)            // 30%
```

### **statusHelpers.ts** — Status Colors & Labels

```typescript
import { 
  getStockStatusColor, 
  getStockStatusLabel,
  determineStockStatus 
} from '@/utils';

// Determine stock status
const status = determineStockStatus(8, 30); // remaining=8, min=30 → 'critical'

// Get UI colors
const color = getStockStatusColor(status);      // '#B92020' (red)
const bg = getStockStatusBg(status);            // '#FDEAEA'
const label = getStockStatusLabel(status);      // '🚨 Critical'

// Same for payments
getPaymentStatusColor('overdue')  // '#B92020'
getPaymentStatusLabel('overdue')  // '⚠ Overdue'
```

### **validators.ts** — Form Validation

```typescript
import { 
  isValidEmail, 
  isValidPassword, 
  isRequired,
  validateForm 
} from '@/utils';

// Individual validators
isValidEmail('user@example.com')  // true
isValidPassword('Pass@123')       // { valid: true, errors: [] }
isRequired('hello')               // true
isInRange(50, 1, 100)             // true
isValidPhoneNumber('+639175551234') // true

// Validate entire form
const schema = {
  email: (v) => isValidEmail(v) ? null : 'Invalid email',
  password: (v) => v.length < 8 ? 'Min 8 characters' : null,
};
const errors = validateForm(formData, schema);
// { email: null, password: 'Min 8 characters' }
```

---

## 🪝 Hooks

### **useAuth()** — Authentication

```typescript
import { useAuth } from '@/hooks';

export default function LoginPage() {
  const { user, isAuthenticated, login, logout, hasRole } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123', 'supplier');
    } catch (error) {
      console.error('Login failed');
    }
  };

  if (!isAuthenticated) return <LoginPage />;

  if (hasRole('supplier')) {
    return <SupplierDashboard user={user} />;
  }

  return <div onClick={logout}>Logout</div>;
}
```

### **useFetch()** — Data Fetching

```typescript
import { useFetch } from '@/hooks';

export default function ProductList() {
  const { data: products, loading, error, refetch } = useFetch('/api/products');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {products.map(p => <div key={p.id}>{p.name}</div>)}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### **useForm()** — Form State & Validation

```typescript
import { useForm } from '@/hooks';
import { isValidEmail, isRequired } from '@/utils';

export default function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    validationSchema: {
      email: (v) => isRequired(v) && isValidEmail(v) ? null : 'Invalid email',
      password: (v) => isRequired(v) ? null : 'Password required',
    },
    onSubmit: async (values) => {
      console.log('Submit:', values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      {form.touched.email && form.errors.email && (
        <span className="error">{form.errors.email}</span>
      )}

      <input
        name="password"
        type="password"
        value={form.values.password}
        onChange={form.handleChange}
      />
      {form.errors.password && <span>{form.errors.password}</span>}

      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### **useLocalStorage()** — Persistent State

```typescript
import { useLocalStorage } from '@/hooks';

export default function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [filters, setFilters] = useLocalStorage('filters', {});

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option>light</option>
        <option>dark</option>
      </select>
      {/* Theme is automatically saved & restored */}
    </div>
  );
}
```

---

## 📡 API Service

Centralized API client with automatic error handling and auth token injection.

```typescript
import { api } from '@/services/api';

// Get products
const products = await api.products.list(token);
const product = await api.products.get(productId, token);

// Create product
await api.products.create({ name: 'New Product' }, token);

// Record sale
await api.sales.create({ productId, quantity: 5 }, token);

// Get sales reports
const reports = await api.sales.getReports(token, '?month=March');

// Submit payment
await api.payments.submit({ hotelId, amount: 5000 }, token);
```

---

## 🎯 Best Practices

### **1. Use Utils for Repeated Logic**
```typescript
// ❌ Bad - repeated everywhere
const color = status === 'critical' ? '#B92020' : '#2D7A4F';

// ✅ Good - use utility
const color = getStockStatusColor(status);
```

### **2. Centralize Form Logic**
```typescript
// ✅ All form logic in one hook
const form = useForm({ initialValues: {}, onSubmit, validationSchema });
```

### **3. Type-Safe API Calls**
```typescript
// ✅ Use API service for consistency
const data = await api.products.list(token);
```

### **4. Reuse Validation Schemas**
```typescript
// Create once, use everywhere
export const productSchema = {
  name: (v) => isRequired(v) ? null : 'Name required',
  sku: (v) => isValidSKU(v) ? null : 'Invalid SKU',
};

// Usage
const form = useForm({ validationSchema: productSchema, ... });
```

---

## 📦 Import Examples

```typescript
// Import all utils
import { formatCurrency, isValidEmail, getStockStatusColor } from '@/utils';

// Import specific util module
import * as validators from '@/utils/validators';

// Import hooks
import { useAuth, useForm, useFetch, useLocalStorage } from '@/hooks';

// Import API
import { api } from '@/services/api';
```

---

## 🔄 Common Patterns

### Login Flow
```typescript
const { login, user } = useAuth();
const form = useForm({
  initialValues: { email: '', password: '', role: 'supplier' },
  validationSchema: { /* ... */ },
  onSubmit: async (values) => {
    await login(values.email, values.password, values.role);
  },
});
```

### Fetch & Display
```typescript
const { data, loading, error } = useFetch('/api/products');
const [filters, setFilters] = useLocalStorage('productFilters', {});
```

### Protected Route
```typescript
const { isAuthenticated, hasRole } = useAuth();
if (!isAuthenticated) return <Redirect to="/login" />;
if (!hasRole('admin')) return <Redirect to="/forbidden" />;
```

---

## 📝 Notes

- All utilities are **type-safe** with TypeScript
- Hooks follow **React best practices** (useCallback, useMemo)
- API service handles **timeout and error handling** automatically
- Validation runs on **blur and submit** for smooth UX
- localStorage hooks handle **SSR safely**

