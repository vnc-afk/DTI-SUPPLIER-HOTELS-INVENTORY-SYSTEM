"use client";

import { useFetch } from "@/hooks/useFetch";
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
import { useRole } from "@/contexts/use-role";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

type DashboardCard = {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
};

type DashboardResponse = {
  metrics?: DashboardCard[];
  chartData?: Array<Record<string, string | number>>;
  lowStockItems?: Array<{ product: string; hotel: string; stock: number }>;
  recentPayments?: Array<{ hotel: string; amount: string; status: "paid" | "pending" | "overdue" }>;
  items?: Array<{ name: string; supplier: string; qty: number; price: string }>;
  performanceData?: Array<{ product: string; sales: number; returns: number }>;
  recentActivity?: Array<{ action: string; user: string; time: string }>;
  compliance?: Array<{ supplier: string; amount: string; status: "paid" | "pending" | "overdue"; dueDate?: string }>;
};

function SupplierDashboard({ data }: { data?: DashboardResponse }) {
  return (
    <div className="space-y-8">
      <div>
        <h1>Supplier Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory and sales</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(data?.metrics || []).map((metric) => (
          <StatCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            icon={metric.title.includes("Product") ? <Package className="h-6 w-6" /> : metric.title.includes("Hotel") ? <Building2 className="h-6 w-6" /> : metric.title.includes("Alert") ? <AlertTriangle className="h-6 w-6" /> : <DollarSign className="h-6 w-6" />}
            trend={metric.trend}
            trendUp={metric.trendUp}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.chartData || []}>
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
              {(data?.lowStockItems || []).map((item, index) => (
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
                {(data?.recentPayments || []).map((payment, index) => (
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

function HotelDashboard({ data }: { data?: DashboardResponse }) {
  return (
    <div className="space-y-8">
      <div>
        <h1>Hotel Dashboard</h1>
        <p className="text-muted-foreground">Manage your consignment inventory and sales</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(data?.metrics || []).map((metric) => (
          <StatCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            icon={metric.title.includes("Sales") ? <ShoppingCart className="h-6 w-6" /> : metric.title.includes("Payment") ? <TrendingUp className="h-6 w-6" /> : metric.title.includes("Revenue") ? <DollarSign className="h-6 w-6" /> : <Package className="h-6 w-6" />}
            trend={metric.trend}
            trendUp={metric.trendUp}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.chartData || []}>
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
              {(data?.items || []).map((item, index) => (
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

function AdminDashboard({ data }: { data?: DashboardResponse }) {
  return (
    <div className="space-y-8">
      <div>
        <h1>DTI Admin Dashboard</h1>
        <p className="text-muted-foreground">System-wide monitoring and compliance</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(data?.metrics || []).map((metric) => (
          <StatCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            icon={metric.title.includes("User") ? <Users className="h-6 w-6" /> : metric.title.includes("Supplier") ? <Truck className="h-6 w-6" /> : metric.title.includes("Compliance") ? <ShieldCheck className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
            trend={metric.trend}
            trendUp={metric.trendUp}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.performanceData || []}>
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
              {(data?.recentActivity || []).map((activity, index) => (
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
                {(data?.compliance || []).map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-4 font-medium">{item.supplier}</td>
                    <td className="px-4 py-4">{item.amount}</td>
                    <td className="px-4 py-4">{item.dueDate || "—"}</td>
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
  const { data, loading, error } = useFetch<DashboardResponse>(`/api/dashboard?role=${role}`);

  if (loading) {
    return (
      <RoleGate allowedRoles={["supplier", "hotel", "admin"]}>
        <DashboardLayout>
          <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading dashboard...</div>
        </DashboardLayout>
      </RoleGate>
    );
  }

  if (error) {
    return (
      <RoleGate allowedRoles={["supplier", "hotel", "admin"]}>
        <DashboardLayout>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
            Failed to load dashboard data.
          </div>
        </DashboardLayout>
      </RoleGate>
    );
  }

  return (
    <RoleGate allowedRoles={["supplier", "hotel", "admin"]}>
      <DashboardLayout>
        {role === "admin" ? <AdminDashboard data={data || undefined} /> : role === "hotel" ? <HotelDashboard data={data || undefined} /> : <SupplierDashboard data={data || undefined} />}
      </DashboardLayout>
    </RoleGate>
  );
}