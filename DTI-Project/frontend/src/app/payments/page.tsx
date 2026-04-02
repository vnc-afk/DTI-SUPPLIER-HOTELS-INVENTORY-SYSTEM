"use client";

import { useRole } from "@/contexts/use-role";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Send } from "lucide-react";

const supplierPayments = [
  { id: 1, hotel: "Grand Plaza Hotel", amount: "₱45,000", date: "Mar 15, 2026", status: "paid" as const },
  { id: 2, hotel: "Seaside Resort", amount: "₱32,500", date: "Mar 18, 2026", status: "pending" as const },
  { id: 3, hotel: "Mountain View Inn", amount: "₱28,000", date: "Mar 10, 2026", status: "overdue" as const },
  { id: 4, hotel: "City Center Hotel", amount: "₱51,200", date: "Mar 20, 2026", status: "paid" as const },
  { id: 5, hotel: "Bayfront Hotel", amount: "₱19,800", date: "Mar 22, 2026", status: "pending" as const },
];

function PaymentsContent() {
  const { role } = useRole();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-3">
            <DollarSign className="h-8 w-8" />
            {role === "supplier" ? "Payment Status" : "Submit Payment"}
          </h1>
          <p className="text-muted-foreground">
            {role === "supplier" ? "Track payments from hotels" : "Submit payments to your suppliers"}
          </p>
        </div>

        {role === "hotel" && (
          <Card>
            <CardHeader><CardTitle>New Payment</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-base">Supplier</Label>
                  <Input placeholder="Select supplier" className="py-6 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Amount (₱)</Label>
                  <Input type="number" placeholder="Enter amount" className="py-6 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Reference Number</Label>
                  <Input placeholder="e.g., TXN-00123" className="py-6 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Payment Date</Label>
                  <Input type="date" className="py-6 text-base" />
                </div>
              </div>
              <Button size="lg" className="px-8 py-6 text-base">
                <Send className="mr-2 h-5 w-5" />
                Submit Payment
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{role === "supplier" ? "Payment History" : "Your Payments"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">{role === "supplier" ? "Hotel" : "Supplier"}</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Amount</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Date</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierPayments.map((payment) => (
                    <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 font-medium">{payment.hotel}</td>
                      <td className="px-4 py-4">{payment.amount}</td>
                      <td className="px-4 py-4">{payment.date}</td>
                      <td className="px-4 py-4"><StatusBadge status={payment.status} /></td>
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

export default function PaymentsPage() {
  return (
    <RoleGate allowedRoles={["supplier", "hotel"]}>
      <PaymentsContent />
    </RoleGate>
  );
}