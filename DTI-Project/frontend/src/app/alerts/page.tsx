"use client";

import { AlertTriangle, CheckCircle, Bell } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StockAlert } from "@/types";

function AlertsContent() {
  const { data, loading, error } = useFetch<StockAlert[]>("/api/alerts");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading alerts...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          Failed to load alerts.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-destructive" />
              Low-Stock Alerts
            </h1>
            <p className="text-muted-foreground">{(data || []).length} items need attention</p>
          </div>
        </div>

        <div className="space-y-4">
          {(data || []).map((alert: StockAlert) => (
            <Card key={alert.id} className={`border-l-4 ${alert.severity === "danger" ? "border-l-destructive" : "border-l-warning"}`}>
              <CardContent className="p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${alert.severity === "danger" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{alert.productName}</p>
                      <p className="text-muted-foreground">{alert.hotelName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Stock: <span className="font-bold text-destructive">{alert.currentStock}</span> / Min: {alert.minStock}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{new Date(alert.createdAt).toLocaleDateString()}</span>
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