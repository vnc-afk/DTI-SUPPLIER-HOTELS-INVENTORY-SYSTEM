"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import { Users, Truck, TrendingUp, ShieldCheck, Package, Building2, AlertTriangle, DollarSign, ShoppingCart } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { RoleGate } from "@/components/layout/RoleGate";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

const supplierSalesData = [
  { month: "Jan", sales: 4200 },
  { month: "Feb", sales: 3800 },
  { month: "Mar", sales: 5100 },
  { month: "Apr", sales: 4600 },
  { month: "May", sales: 5800 },
  { month: "Jun", sales: 6200 },
];

const supplierLowStockItems = [
  { product: "Shampoo 500ml", hotel: "Grand Plaza", stock: 5 },
  { product: "Bath Soap", hotel: "Seaside Resort", stock: 8 },
  { product: "Towels (Large)", hotel: "Mountain View", stock: 3 },
];

const supplierRecentPayments = [
  { hotel: "Grand Plaza Hotel", amount: "₱45,000", status: "paid" as const },
  { hotel: "Seaside Resort", amount: "₱32,500", status: "pending" as const },
  { hotel: "Mountain View Inn", amount: "₱28,000", status: "overdue" as const },
  { hotel: "City Center Hotel", amount: "₱51,200", status: "paid" as const },
];

const hotelSalesData = [
  { week: "Week 1", sales: 1200 },
  { week: "Week 2", sales: 1800 },
  { week: "Week 3", sales: 1500 },
  { week: "Week 4", sales: 2200 },
];

const hotelConsignmentProducts = [
  { name: "Premium Shampoo", qty: 45, supplier: "CleanCo", price: "₱180" },
  { name: "Bath Soap Set", qty: 120, supplier: "CleanCo", price: "₱95" },
  { name: "Hand Towels (6pc)", qty: 30, supplier: "TextilePro", price: "₱450" },
  { name: "Shower Gel 250ml", qty: 68, supplier: "CleanCo", price: "₱210" },
];

const adminPerformanceData = [
  { product: "Shampoo", sales: 820, returns: 12 },
  { product: "Soap", sales: 1450, returns: 25 },
  { product: "Towels", sales: 340, returns: 5 },
  { product: "Gel", sales: 690, returns: 8 },
  { product: "Lotion", sales: 520, returns: 15 },
];

const adminRecentActivity = [
  { action: "New supplier registered", user: "TextilePro Inc.", time: "2 hours ago" },
  { action: "Payment received", user: "Grand Plaza Hotel", time: "4 hours ago" },
  { action: "Low stock alert", user: "Seaside Resort", time: "6 hours ago" },
  { action: "Sales report generated", user: "System", time: "8 hours ago" },
  { action: "User account updated", user: "Juan Reyes", time: "1 day ago" },
];

const adminComplianceData = [
  { supplier: "CleanCo Supplies", status: "paid" as const, amount: "₱125,000", due: "Mar 15" },
  { supplier: "TextilePro Inc.", status: "pending" as const, amount: "₱78,500", due: "Mar 20" },
  { supplier: "HotelEssentials", status: "overdue" as const, amount: "₱45,200", due: "Mar 10" },
];

function SupplierDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1>Supplier Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory and sales</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={148} icon={<Package className="h-6 w-6" />} trend="↑ 12 this month" trendUp />
        <StatCard title="Hotels Served" value={12} icon={<Building2 className="h-6 w-6" />} />
        <StatCard title="Low Stock Alerts" value={7} icon={<AlertTriangle className="h-6 w-6" />} trend="3 critical" />
        <StatCard title="Revenue (Month)" value="₱186K" icon={<DollarSign className="h-6 w-6" />} trend="↑ 8.2%" trendUp />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 85%)" />
                <XAxis dataKey="month" tick={{ fontSize: 16 }} />
                <YAxis tick={{ fontSize: 16 }} />
                <Tooltip contentStyle={{ fontSize: 16 }} />
                <Legend wrapperStyle={{ fontSize: 16 }} />
                <Bar dataKey="sales" name="Sales (₱)" fill="hsl(220, 60%, 30%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplierLowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <div>
                    <p className="font-semibold text-foreground">{item.product}</p>
                    <p className="text-sm text-muted-foreground">{item.hotel}</p>
                  </div>
                  <StatusBadge status="low" label={`${item.stock} left`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Hotel</th>
                  <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Amount</th>
                  <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {supplierRecentPayments.map((payment, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-4 font-medium">{payment.hotel}</td>
                    <td className="px-4 py-4">{payment.amount}</td>
                    <td className="px-4 py-4"><StatusBadge status={payment.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HotelDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1>Hotel Dashboard</h1>
        <p className="text-muted-foreground">Manage your consignment inventory and sales</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Products on Hand" value={263} icon={<Package className="h-6 w-6" />} />
        <StatCard title="Sales Today" value={18} icon={<ShoppingCart className="h-6 w-6" />} trend="↑ 5 from yesterday" trendUp />
        <StatCard title="Revenue (Week)" value="₱28.5K" icon={<DollarSign className="h-6 w-6" />} trend="↑ 12%" trendUp />
        <StatCard title="Pending Payment" value="₱45K" icon={<TrendingUp className="h-6 w-6" />} trend="Due in 5 days" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hotelSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 85%)" />
                <XAxis dataKey="week" tick={{ fontSize: 16 }} />
                <YAxis tick={{ fontSize: 16 }} />
                <Tooltip contentStyle={{ fontSize: 16 }} />
                <Legend wrapperStyle={{ fontSize: 16 }} />
                <Line type="monotone" dataKey="sales" name="Sales (₱)" stroke="hsl(145, 60%, 36%)" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Consignment Products</CardTitle>
            <Button size="lg" className="text-base">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Record Sale
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hotelConsignmentProducts.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-xl border bg-secondary p-4">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.supplier} · {item.price}/unit</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">{item.qty}</p>
                    <p className="text-sm text-muted-foreground">in stock</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1>DTI Admin Dashboard</h1>
        <p className="text-muted-foreground">System-wide monitoring and compliance</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={84} icon={<Users className="h-6 w-6" />} trend="↑ 6 this month" trendUp />
        <StatCard title="Active Suppliers" value={23} icon={<Truck className="h-6 w-6" />} />
        <StatCard title="Total Sales (Month)" value="₱1.2M" icon={<TrendingUp className="h-6 w-6" />} trend="↑ 15.3%" trendUp />
        <StatCard title="Compliance Rate" value="92%" icon={<ShieldCheck className="h-6 w-6" />} trend="↑ 3%" trendUp />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adminPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 85%)" />
                <XAxis dataKey="product" tick={{ fontSize: 16 }} />
                <YAxis tick={{ fontSize: 16 }} />
                <Tooltip contentStyle={{ fontSize: 16 }} />
                <Legend wrapperStyle={{ fontSize: 16 }} />
                <Bar dataKey="sales" name="Sales" fill="hsl(220, 60%, 30%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="returns" name="Returns" fill="hsl(0, 72%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminRecentActivity.map((activity, index) => (
                <div key={index} className="flex items-start justify-between rounded-lg p-3 hover:bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="whitespace-nowrap text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Supplier</th>
                  <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Amount</th>
                  <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Due Date</th>
                  <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminComplianceData.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-4 font-medium">{item.supplier}</td>
                    <td className="px-4 py-4">{item.amount}</td>
                    <td className="px-4 py-4">{item.due}</td>
                    <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useRole();

  return (
    <RoleGate allowedRoles={["supplier", "hotel", "admin"]}>
      <DashboardLayout>
        {role === "admin" ? <AdminDashboard /> : role === "hotel" ? <HotelDashboard /> : <SupplierDashboard />}
      </DashboardLayout>
    </RoleGate>
  );
}