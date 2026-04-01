"use client";

import { RoleGate } from "@/components/layout/RoleGate";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

const products = [
  { name: "Premium Shampoo 500ml", supplier: "CleanCo", qty: 45, price: "₱180", image: "🧴" },
  { name: "Bath Soap Set (3pc)", supplier: "CleanCo", qty: 120, price: "₱95", image: "🧼" },
  { name: "Hand Towels (6pc)", supplier: "TextilePro", qty: 30, price: "₱450", image: "🏨" },
  { name: "Shower Gel 250ml", supplier: "CleanCo", qty: 68, price: "₱210", image: "🚿" },
  { name: "Dental Kit", supplier: "CleanCo", qty: 85, price: "₱55", image: "🪥" },
  { name: "Body Lotion 300ml", supplier: "CleanCo", qty: 42, price: "₱260", image: "✨" },
  { name: "Slippers (Pair)", supplier: "TextilePro", qty: 55, price: "₱85", image: "🩴" },
  { name: "Conditioner 500ml", supplier: "CleanCo", qty: 38, price: "₱195", image: "💆" },
];

function ConsignmentContent() {
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
          {products.map((product, index) => (
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