"use client";

import { useState } from "react";
import { FileText, Search } from "lucide-react";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const logs = [
  { timestamp: "2026-03-31 14:32:05", user: "Maria Santos", action: "Added product", details: "Premium Shampoo 500ml (SKU: SHP-001)", type: "create" },
  { timestamp: "2026-03-31 14:15:22", user: "Juan Reyes", action: "Recorded sale", details: "5x Dental Kit — Grand Plaza Hotel", type: "sale" },
  { timestamp: "2026-03-31 13:48:10", user: "System", action: "Low stock alert", details: "Hand Towels at Seaside Resort (3 remaining)", type: "alert" },
  { timestamp: "2026-03-31 12:30:00", user: "Ana Cruz", action: "Updated product", details: "Changed price of Shower Gel from ₱200 to ₱210", type: "update" },
  { timestamp: "2026-03-31 11:15:44", user: "Carlos Lim", action: "Submitted payment", details: "₱32,500 to CleanCo Supplies", type: "payment" },
  { timestamp: "2026-03-31 10:02:33", user: "DTI Officer", action: "Deactivated user", details: "Pedro Reyes — HotelEssentials", type: "admin" },
  { timestamp: "2026-03-30 16:45:12", user: "Rosa Dela Cruz", action: "Recorded sale", details: "10x Bath Soap Set — Mountain View Inn", type: "sale" },
  { timestamp: "2026-03-30 15:20:08", user: "System", action: "Report generated", details: "Monthly sales report — March 2026", type: "system" },
  { timestamp: "2026-03-30 14:10:55", user: "Lisa Garcia", action: "Submitted payment", details: "₱51,200 to TextilePro Inc.", type: "payment" },
  { timestamp: "2026-03-30 12:05:30", user: "Maria Santos", action: "Restocked product", details: "Added 50 units of Body Lotion to Mountain View Inn", type: "update" },
  { timestamp: "2026-03-30 10:30:18", user: "DTI Officer", action: "Approved supplier", details: "New supplier: FreshSupplies Co.", type: "admin" },
  { timestamp: "2026-03-29 16:22:40", user: "System", action: "Overdue payment alert", details: "HotelEssentials — ₱45,200 past due", type: "alert" },
];

const typeColors: Record<string, string> = {
  create: "bg-success/15 text-success",
  sale: "bg-primary/15 text-primary",
  alert: "bg-destructive/15 text-destructive",
  update: "bg-accent/15 text-accent-foreground",
  payment: "bg-warning/15 text-warning",
  admin: "bg-muted text-muted-foreground",
  system: "bg-secondary text-secondary-foreground",
};

function AuditLogsContent() {
  const [search, setSearch] = useState("");
  const filtered = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground">Complete activity history across the system</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, action, or details..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="py-6 text-base"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b">
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Timestamp</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">User</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Action</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 whitespace-nowrap font-mono text-sm text-muted-foreground">{log.timestamp}</td>
                      <td className="px-4 py-4 font-medium">{log.user}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${typeColors[log.type]}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{log.details}</td>
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

export default function AuditLogsPage() {
  return (
    <RoleGate allowedRoles={["admin"]}>
      <AuditLogsContent />
    </RoleGate>
  );
}