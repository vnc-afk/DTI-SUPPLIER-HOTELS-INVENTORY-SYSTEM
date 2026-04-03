"use client";

import { useState } from "react";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/services/api";

type ProductRow = {
  id: string;
  name: string;
  stock: number;
  price: number;
};

type RecentSaleRow = {
  product: string;
  qty: number;
  total: string;
  time: string;
};

function RecordSaleContent() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const { data: productsData, loading, error, refetch } = useFetch<ProductRow[]>("/api/products");
  const { data: recentSalesData } = useFetch<RecentSaleRow[]>("/api/sales/recent");
  const [submitting, setSubmitting] = useState(false);

  const products = Array.isArray(productsData) ? productsData : [];
  const recentSales = Array.isArray(recentSalesData) ? recentSalesData : [];

  const selected = products.find((product) => product.id === selectedProduct);
  const total = selected && quantity ? selected.price * Number(quantity) : 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.sales.create({ productId: selectedProduct, quantity: Number(quantity) }, "");
      setSelectedProduct("");
      setQuantity("");
      await refetch();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading sale data...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          Failed to load sale data.
        </div>
      </DashboardLayout>
    );
  }

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

              <Button size="lg" className="w-full py-6 text-base" disabled={!selected || !quantity || submitting} onClick={handleSubmit}>
                <CheckCircle className="mr-2 h-5 w-5" />
                {submitting ? "Recording..." : "Record Sale"}
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