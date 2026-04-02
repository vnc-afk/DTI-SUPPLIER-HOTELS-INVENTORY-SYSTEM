"use client";

import { useRole } from "@/contexts/use-role";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlySales = [
  { month: "Jan", sales: 42000 },
  { month: "Feb", sales: 38000 },
  { month: "Mar", sales: 51000 },
  { month: "Apr", sales: 46000 },
  { month: "May", sales: 58000 },
  { month: "Jun", sales: 62000 },
];

const dailySales = [
  { day: "Mon", sales: 3200 },
  { day: "Tue", sales: 2800 },
  { day: "Wed", sales: 4100 },
  { day: "Thu", sales: 3600 },
  { day: "Fri", sales: 5200 },
  { day: "Sat", sales: 6100 },
  { day: "Sun", sales: 4800 },
];

const categoryData = [
  { name: "Toiletries", value: 45 },
  { name: "Linens", value: 25 },
  { name: "Amenities", value: 20 },
  { name: "Other", value: 10 },
];

const colors = ["hsl(220, 60%, 30%)", "hsl(145, 60%, 36%)", "hsl(38, 90%, 55%)", "hsl(210, 15%, 70%)"];

function SalesReportsContent() {
  const { role } = useRole();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1>Sales Reports</h1>
          <p className="text-muted-foreground">
            {role === "supplier" ? "Track sales across all hotels" : "View your hotel's sales performance"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Monthly Sales Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 85%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 16 }} />
                  <YAxis tick={{ fontSize: 16 }} tickFormatter={(value) => `₱${value / 1000}K`} />
                  <Tooltip contentStyle={{ fontSize: 16 }} formatter={(value: number) => [`₱${value.toLocaleString()}`, "Sales"]} />
                  <Legend wrapperStyle={{ fontSize: 16 }} />
                  <Bar dataKey="sales" name="Sales (₱)" fill="hsl(220, 60%, 30%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Daily Sales (This Week)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 85%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 16 }} />
                  <YAxis tick={{ fontSize: 16 }} tickFormatter={(value) => `₱${value / 1000}K`} />
                  <Tooltip contentStyle={{ fontSize: 16 }} formatter={(value: number) => [`₱${value.toLocaleString()}`, "Sales"]} />
                  <Legend wrapperStyle={{ fontSize: 16 }} />
                  <Line type="monotone" dataKey="sales" name="Daily Sales" stroke="hsl(145, 60%, 36%)" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ strokeWidth: 2 }}
                    style={{ fontSize: 16 }}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 16 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {[
                { label: "Total Sales (This Month)", value: "₱62,000" },
                { label: "Average Daily Sales", value: "₱4,257" },
                { label: "Best Selling Product", value: "Bath Soap Set" },
                { label: "Top Hotel", value: "Grand Plaza Hotel" },
                { label: "Growth vs Last Month", value: "+8.2%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b py-3 last:border-0">
                  <span className="font-medium text-muted-foreground">{item.label}</span>
                  <span className="text-lg font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function SalesReportsPage() {
  return (
    <RoleGate allowedRoles={["supplier", "hotel"]}>
      <SalesReportsContent />
    </RoleGate>
  );
}