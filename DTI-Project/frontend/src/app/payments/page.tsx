"use client";

import { useState } from "react";
import { useRole } from "@/contexts/use-role";
import { useFetch } from "@/hooks/useFetch";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Send } from "lucide-react";
import { api } from "@/services/api";

function PaymentsContent() {
  const { role } = useRole();
  const { data, loading, error, refetch } = useFetch<any>("/api/payments");
  const [supplierName, setSupplierName] = useState("");
  const [amount, setAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.payments.submit(
        {
          supplierName,
          hotelName: role === "hotel" ? "Grand Plaza Hotel" : "Grand Plaza Hotel",
          amount: Number(amount),
          referenceNumber,
          paymentDate,
        },
        "",
      );
      setSupplierName("");
      setAmount("");
      setReferenceNumber("");
      setPaymentDate("");
      await refetch();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading payments...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          Failed to load payments.
        </div>
      </DashboardLayout>
    );
  }

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
                  <Input placeholder="Select supplier" value={supplierName} onChange={(event) => setSupplierName(event.target.value)} className="py-6 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Amount (₱)</Label>
                  <Input type="number" placeholder="Enter amount" value={amount} onChange={(event) => setAmount(event.target.value)} className="py-6 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Reference Number</Label>
                  <Input placeholder="e.g., TXN-00123" value={referenceNumber} onChange={(event) => setReferenceNumber(event.target.value)} className="py-6 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Payment Date</Label>
                  <Input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} className="py-6 text-base" />
                </div>
              </div>
              <Button size="lg" className="px-8 py-6 text-base" onClick={handleSubmit} disabled={submitting}>
                <Send className="mr-2 h-5 w-5" />
                {submitting ? "Submitting..." : "Submit Payment"}
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
                    {(data || []).map((payment: any) => (
                    <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 font-medium">{payment.hotel}</td>
                      <td className="px-4 py-4">{payment.amount}</td>
                        <td className="px-4 py-4">{payment.dueDate || payment.date || payment.paidDate || "—"}</td>
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