"use client";

import { useFetch } from "@/hooks/useFetch";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { ShieldCheck, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

function PaymentComplianceContent() {
  type ComplianceRow = {
    supplier: string;
    hotel: string;
    amount: string;
    dueDate: string;
    paidDate: string;
    status: "paid" | "pending" | "overdue";
  };

  const { data, loading, error } = useFetch<{ complianceData: ComplianceRow[] }>("/api/reports/compliance");
  const complianceData = data?.complianceData || [];
  const paid = complianceData.filter((item: ComplianceRow) => item.status === "paid").length;
  const pending = complianceData.filter((item: ComplianceRow) => item.status === "pending").length;
  const overdue = complianceData.filter((item: ComplianceRow) => item.status === "overdue").length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading compliance data...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          Failed to load compliance data.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8" />
            Payment Compliance
          </h1>
          <p className="text-muted-foreground">Monitor payment compliance across all entities</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard title="Paid" value={paid} icon={<CheckCircle className="h-6 w-6" />} />
          <StatCard title="Pending" value={pending} icon={<AlertTriangle className="h-6 w-6" />} />
          <StatCard title="Overdue" value={overdue} icon={<XCircle className="h-6 w-6" />} />
        </div>

        <Card>
          <CardHeader><CardTitle>Compliance Records</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Supplier</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Hotel</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Amount</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Due Date</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Paid Date</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceData.map((item: ComplianceRow, index: number) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 font-medium">{item.supplier}</td>
                      <td className="px-4 py-4">{item.hotel}</td>
                      <td className="px-4 py-4">{item.amount}</td>
                      <td className="px-4 py-4">{item.dueDate}</td>
                      <td className="px-4 py-4">{item.paidDate}</td>
                      <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
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

export default function PaymentCompliancePage() {
  return (
    <RoleGate allowedRoles={["admin"]}>
      <PaymentComplianceContent />
    </RoleGate>
  );
}