"use client";

import { useFetch } from "@/hooks/useFetch";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";


function ConsignmentContent() {
  const { data, loading, error } = useFetch<any>("/api/consignments");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading consignment items...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          Failed to load consignment items.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-3">
            <Package className="h-8 w-8" />
            Consignment Products
          </h1>
          <p className="text-muted-foreground">Products currently on consignment at your hotel</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(data || []).map((product: any, index: number) => (
            <Card key={index} className="transition-shadow hover:shadow-md">
              <CardContent className="space-y-4 p-6 text-center">
                <div className="text-5xl">{product.image}</div>
                <div>
                  <h4 className="text-foreground">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">{product.supplier}</p>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">In Stock</p>
                    <p className="text-xl font-bold text-foreground">{product.qty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold text-foreground">{product.price}</p>
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

export default function ConsignmentPage() {
  return (
    <RoleGate allowedRoles={["hotel"]}>
      <ConsignmentContent />
    </RoleGate>
  );
}