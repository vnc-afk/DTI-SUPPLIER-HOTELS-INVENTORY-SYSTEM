"use client";

import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { TrendingUp, DollarSign, ShoppingCart, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const hotelSalesData = [
  { hotel: "Grand Plaza", sales: 125000 },
  { hotel: "Seaside", sales: 98000 },
  { hotel: "Mountain View", sales: 76000 },
  { hotel: "City Center", sales: 112000 },
  { hotel: "Bayfront", sales: 54000 },
];

function SalesMonitoringContent() {
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
          <StatCard title="Total Revenue" value="₱1.24M" icon={<DollarSign className="h-6 w-6" />} trend="↑ 15.3% vs last month" trendUp />
          <StatCard title="Total Transactions" value="2,847" icon={<ShoppingCart className="h-6 w-6" />} trend="↑ 230 this week" trendUp />
          <StatCard title="Active Hotels" value={12} icon={<Building2 className="h-6 w-6" />} />
          <StatCard title="Avg. Order Value" value="₱435" icon={<TrendingUp className="h-6 w-6" />} trend="↑ 3.2%" trendUp />
        </div>

        <Card>
          <CardHeader><CardTitle>Sales by Hotel</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={hotelSalesData} layout="vertical">
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