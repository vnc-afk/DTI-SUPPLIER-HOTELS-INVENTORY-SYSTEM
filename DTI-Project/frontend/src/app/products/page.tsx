"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { RoleGate } from "@/components/layout/RoleGate";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";

const initialProducts = [
  { id: 1, name: "Premium Shampoo 500ml", sku: "SHP-001", stock: 320, price: "₱180", status: "active" as const },
  { id: 2, name: "Bath Soap Set (3pc)", sku: "BSP-002", stock: 540, price: "₱95", status: "active" as const },
  { id: 3, name: "Hand Towels (6pc)", sku: "TWL-003", stock: 12, price: "₱450", status: "low" as const },
  { id: 4, name: "Shower Gel 250ml", sku: "SGL-004", stock: 185, price: "₱210", status: "active" as const },
  { id: 5, name: "Conditioner 500ml", sku: "CND-005", stock: 0, price: "₱195", status: "inactive" as const },
  { id: 6, name: "Body Lotion 300ml", sku: "BLT-006", stock: 8, price: "₱260", status: "low" as const },
  { id: 7, name: "Dental Kit", sku: "DNT-007", stock: 420, price: "₱55", status: "active" as const },
  { id: 8, name: "Slippers (Pair)", sku: "SLP-008", stock: 200, price: "₱85", status: "active" as const },
];

function ProductsContent() {
  const [search, setSearch] = useState("");
  const filtered = initialProducts.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1>Product Management</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button size="lg" className="px-8 py-6 text-base">
            <Plus className="mr-2 h-5 w-5" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products by name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="py-6 text-base"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Product Name</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">SKU</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Stock</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Price</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 font-medium">{product.name}</td>
                      <td className="px-4 py-4 text-muted-foreground">{product.sku}</td>
                      <td className="px-4 py-4 font-semibold">{product.stock}</td>
                      <td className="px-4 py-4">{product.price}</td>
                      <td className="px-4 py-4"><StatusBadge status={product.status} /></td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-10 w-10 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
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

export default function ProductsPage() {
  return (
    <RoleGate allowedRoles={["supplier"]}>
      <ProductsContent />
    </RoleGate>
  );
}