"use client";

import { useState } from "react";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { RoleGate } from "@/components/layout/RoleGate";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const products = [
  { id: "shampoo", name: "Premium Shampoo 500ml", stock: 45, price: 180 },
  { id: "soap", name: "Bath Soap Set (3pc)", stock: 120, price: 95 },
  { id: "towels", name: "Hand Towels (6pc)", stock: 30, price: 450 },
  { id: "gel", name: "Shower Gel 250ml", stock: 68, price: 210 },
  { id: "dental", name: "Dental Kit", stock: 85, price: 55 },
  { id: "lotion", name: "Body Lotion 300ml", stock: 42, price: 260 },
];

const recentSales = [
  { product: "Premium Shampoo 500ml", qty: 3, total: "₱540", time: "10 min ago" },
  { product: "Dental Kit", qty: 5, total: "₱275", time: "30 min ago" },
  { product: "Bath Soap Set (3pc)", qty: 10, total: "₱950", time: "1 hour ago" },
];

function RecordSaleContent() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const selected = products.find((product) => product.id === selectedProduct);
  const total = selected && quantity ? selected.price * Number(quantity) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Record Sale
          </h1>
          <p className="text-muted-foreground">Record a sale and auto-deduct from inventory</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>New Sale</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base">Select Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="py-6 text-base">
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id} className="py-3 text-base">
                        {product.name} — {product.stock} in stock
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  max={selected?.stock || 999}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="Enter quantity"
                  className="py-6 text-base"
                />
              </div>

              {selected && quantity && (
                <div className="space-y-2 rounded-xl border bg-secondary p-5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-medium">{selected.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per unit</span>
                    <span className="font-medium">₱{selected.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">₱{total.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Stock after sale: {selected.stock - Number(quantity)} units</p>
                </div>
              )}

              <Button size="lg" className="w-full py-6 text-base" disabled={!selected || !quantity}>
                <CheckCircle className="mr-2 h-5 w-5" />
                Record Sale
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Recent Sales</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl border bg-secondary p-4">
                    <div>
                      <p className="font-semibold text-foreground">{sale.product}</p>
                      <p className="text-sm text-muted-foreground">Qty: {sale.qty} · {sale.time}</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">{sale.total}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function RecordSalePage() {
  return (
    <RoleGate allowedRoles={["hotel"]}>
      <RecordSaleContent />
    </RoleGate>
  );
}