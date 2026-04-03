"use client";

import { useRole } from "@/contexts/use-role";
import { useFetch } from "@/hooks/useFetch";
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
import {
  SalesReportsData,
  MonthlySalesData,
  DailySalesData,
  CategoryData,
  SummaryItem,
} from "@/types";

const colors = ["hsl(220, 60%, 30%)", "hsl(145, 60%, 36%)", "hsl(38, 90%, 55%)", "hsl(210, 15%, 70%)"];

function SalesReportsContent() {
  const { role } = useRole();
  const { data, loading, error } = useFetch<SalesReportsData>("/api/reports/sales");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading sales reports...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          Failed to load sales reports.
        </div>
      </DashboardLayout>
    );
  }

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
                <BarChart data={data?.monthlySales || []}>
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
                <LineChart data={data?.dailySales || []}>
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
                    data={data?.categoryData || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ strokeWidth: 2 }}
                    style={{ fontSize: 16 }}
                  >
                    {(data?.categoryData || []).map((_: CategoryData, index: number) => (
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
              {(data?.summary || []).map((item: SummaryItem, index: number) => (
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