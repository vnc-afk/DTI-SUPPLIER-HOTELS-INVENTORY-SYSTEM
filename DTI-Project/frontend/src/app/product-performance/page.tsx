"use client";

import { RoleGate } from "@/components/layout/RoleGate";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const performanceData = [
  { product: "Shampoo", sales: 820, returns: 12, rating: 4.5 },
  { product: "Soap Set", sales: 1450, returns: 25, rating: 4.8 },
  { product: "Towels", sales: 340, returns: 5, rating: 4.2 },
  { product: "Shower Gel", sales: 690, returns: 8, rating: 4.6 },
  { product: "Dental Kit", sales: 520, returns: 15, rating: 3.9 },
  { product: "Lotion", sales: 410, returns: 10, rating: 4.3 },
  { product: "Slippers", sales: 380, returns: 3, rating: 4.7 },
  { product: "Conditioner", sales: 290, returns: 7, rating: 4.1 },
];

function ProductPerformanceContent() {
  const getPerformanceColor = (sales: number) => {
    if (sales >= 1000) return "text-success";
    if (sales >= 500) return "text-warning";
    return "text-destructive";
  };

  const getPerformanceLabel = (sales: number) => {
    if (sales >= 1000) return "High";
    if (sales >= 500) return "Medium";
    return "Low";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            Product Performance
          </h1>
          <p className="text-muted-foreground">Analyze product sales and returns across the system</p>
        </div>

        <Card>
          <CardHeader><CardTitle>Sales vs Returns</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 85%)" />
                <XAxis dataKey="product" tick={{ fontSize: 16 }} />
                <YAxis tick={{ fontSize: 16 }} />
                <Tooltip contentStyle={{ fontSize: 16 }} />
                <Legend wrapperStyle={{ fontSize: 16 }} />
                <Bar dataKey="sales" name="Total Sales" fill="hsl(220, 60%, 30%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="returns" name="Returns" fill="hsl(0, 72%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Performance Details</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Product</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Sales</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Returns</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Return Rate</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((product, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 font-medium">{product.product}</td>
                      <td className="px-4 py-4 font-semibold">{product.sales.toLocaleString()}</td>
                      <td className="px-4 py-4">{product.returns}</td>
                      <td className="px-4 py-4">{((product.returns / product.sales) * 100).toFixed(1)}%</td>
                      <td className={`px-4 py-4 font-bold ${getPerformanceColor(product.sales)}`}>{getPerformanceLabel(product.sales)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function ProductPerformancePage() {
  return (
    <RoleGate allowedRoles={["admin"]}>
      <ProductPerformanceContent />
    </RoleGate>
  );
}