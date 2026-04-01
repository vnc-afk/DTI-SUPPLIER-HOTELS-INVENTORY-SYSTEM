"use client";

import { RoleGate } from "@/components/layout/RoleGate";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { ShieldCheck, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const complianceData = [
  { supplier: "CleanCo Supplies", hotel: "Grand Plaza Hotel", amount: "₱125,000", dueDate: "Mar 15, 2026", paidDate: "Mar 14, 2026", status: "paid" as const },
  { supplier: "TextilePro Inc.", hotel: "Seaside Resort", amount: "₱78,500", dueDate: "Mar 20, 2026", paidDate: "—", status: "pending" as const },
  { supplier: "HotelEssentials", hotel: "Mountain View Inn", amount: "₱45,200", dueDate: "Mar 10, 2026", paidDate: "—", status: "overdue" as const },
  { supplier: "CleanCo Supplies", hotel: "City Center Hotel", amount: "₱92,300", dueDate: "Mar 18, 2026", paidDate: "Mar 17, 2026", status: "paid" as const },
  { supplier: "TextilePro Inc.", hotel: "Grand Plaza Hotel", amount: "₱63,700", dueDate: "Mar 22, 2026", paidDate: "—", status: "pending" as const },
  { supplier: "CleanCo Supplies", hotel: "Bayfront Hotel", amount: "₱38,900", dueDate: "Mar 5, 2026", paidDate: "—", status: "overdue" as const },
];

function PaymentComplianceContent() {
  const paid = complianceData.filter((item) => item.status === "paid").length;
  const pending = complianceData.filter((item) => item.status === "pending").length;
  const overdue = complianceData.filter((item) => item.status === "overdue").length;

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
                  {complianceData.map((item, index) => (
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