"use client";

import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { TrendingUp, DollarSign, ShoppingCart, Building2 } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SalesMonitoringData, Metric } from "@/types";

function SalesMonitoringContent() {
  const { data, loading, error } = useFetch<SalesMonitoringData>("/api/reports/monitoring");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading sales monitoring data...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          Failed to load sales monitoring data.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8" />
            Sales Monitoring
          </h1>
          <p className="text-muted-foreground">System-wide sales overview</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(data?.metrics || []).map((metric: Metric) => (
            <StatCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.title.includes("Revenue") ? <DollarSign className="h-6 w-6" /> : metric.title.includes("Transactions") ? <ShoppingCart className="h-6 w-6" /> : metric.title.includes("Hotels") ? <Building2 className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
              trend={metric.trend}
              trendUp={metric.trendUp}
            />
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Sales by Hotel</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data?.hotelSalesData || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 85%)" />
                <XAxis type="number" tick={{ fontSize: 16 }} tickFormatter={(value) => `₱${value / 1000}K`} />
                <YAxis type="category" dataKey="hotel" tick={{ fontSize: 16 }} width={120} />
                <Tooltip contentStyle={{ fontSize: 16 }} formatter={(value: number) => [`₱${value.toLocaleString()}`, "Sales"]} />
                <Legend wrapperStyle={{ fontSize: 16 }} />
                <Bar dataKey="sales" name="Total Sales" fill="hsl(220, 60%, 30%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function SalesMonitoringPage() {
  return (
    <RoleGate allowedRoles={["admin"]}>
      <SalesMonitoringContent />
    </RoleGate>
  );
}