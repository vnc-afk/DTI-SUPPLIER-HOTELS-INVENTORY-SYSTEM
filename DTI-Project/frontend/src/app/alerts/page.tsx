"use client";

import { AlertTriangle, CheckCircle, Bell } from "lucide-react";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const alerts = [
  { id: 1, product: "Hand Towels (6pc)", hotel: "Grand Plaza Hotel", stock: 3, minStock: 10, severity: "critical" as const, time: "10 min ago" },
  { id: 2, product: "Shower Gel 250ml", hotel: "Seaside Resort", stock: 5, minStock: 20, severity: "critical" as const, time: "25 min ago" },
  { id: 3, product: "Body Lotion 300ml", hotel: "Mountain View Inn", stock: 8, minStock: 10, severity: "warning" as const, time: "1 hour ago" },
  { id: 4, product: "Bath Soap Set", hotel: "Grand Plaza Hotel", stock: 12, minStock: 15, severity: "warning" as const, time: "2 hours ago" },
  { id: 5, product: "Dental Kit", hotel: "City Center Hotel", stock: 15, minStock: 25, severity: "warning" as const, time: "3 hours ago" },
];

function AlertsContent() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-destructive" />
              Low-Stock Alerts
            </h1>
            <p className="text-muted-foreground">{alerts.length} items need attention</p>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${alert.severity === "critical" ? "border-l-destructive" : "border-l-warning"}`}>
              <CardContent className="p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${alert.severity === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{alert.product}</p>
                      <p className="text-muted-foreground">{alert.hotel}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Stock: <span className="font-bold text-destructive">{alert.stock}</span> / Min: {alert.minStock}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{alert.time}</span>
                    <Button size="lg" className="text-base">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Restock
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AlertsPage() {
  return (
    <RoleGate allowedRoles={["supplier"]}>
      <AlertsContent />
    </RoleGate>
  );
}