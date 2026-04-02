"use client";

import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Building2, Package } from "lucide-react";
import { useState } from "react";
import { useInventory } from "@/contexts/use-inventory";
import { toast } from "sonner";

const Products = () => {
  const { products, hotels, addProduct, addConsignment } = useInventory();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [consignOpen, setConsignOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [consignHotelId, setConsignHotelId] = useState("");
  const [consignQty, setConsignQty] = useState("");
  const [form, setForm] = useState({ name: "", sku: "", stock: "", price: "" });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!form.name || !form.sku || !form.stock || !form.price) {
      toast.error("Please fill in all fields");
      return;
    }
    const stock = parseInt(form.stock);
    addProduct({
      name: form.name,
      sku: form.sku,
      stock,
      price: `₱${form.price}`,
      status: stock === 0 ? "inactive" : stock < 15 ? "low" : "active",
    });
    toast.success(`${form.name} added!`);
    setForm({ name: "", sku: "", stock: "", price: "" });
    setAddOpen(false);
  };

  const handleConsign = () => {
    if (!consignHotelId || !consignQty || !selectedProductId) {
      toast.error("Please select a hotel and enter quantity");
      return;
    }
    const qty = parseInt(consignQty);
    const product = products.find((p) => p.id === selectedProductId);
    if (product && qty > product.stock) {
      toast.error("Quantity exceeds available stock");
      return;
    }
    const hotel = hotels.find((h) => h.id === parseInt(consignHotelId));
    addConsignment(selectedProductId, parseInt(consignHotelId), qty);
    toast.success(`${qty} units consigned to ${hotel?.name}`);
    setConsignOpen(false);
    setConsignHotelId("");
    setConsignQty("");
    setSelectedProductId(null);
  };

  const openConsignDialog = (productId: number) => {
    setSelectedProductId(productId);
    setConsignOpen(true);
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3">
              <Package className="h-8 w-8" />
              Product Management
            </h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-base py-6 px-8">
                <Plus className="mr-2 h-5 w-5" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label className="text-base">Product Name</Label>
                  <Input placeholder="e.g. Premium Shampoo 500ml" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="text-base py-6" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">SKU</Label>
                  <Input placeholder="e.g. SHP-001" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="text-base py-6" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base">Stock</Label>
                    <Input type="number" placeholder="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="text-base py-6" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Price (₱)</Label>
                    <Input type="number" placeholder="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="text-base py-6" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button size="lg" onClick={handleAddProduct} className="text-base py-6 px-8 w-full">
                  <Plus className="mr-2 h-5 w-5" /> Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Consign Dialog */}
        <Dialog open={consignOpen} onOpenChange={setConsignOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Building2 className="h-5 w-5" /> Consign to Hotel
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Product</p>
                <p className="font-semibold text-lg">{selectedProduct?.name}</p>
                <p className="text-sm text-muted-foreground">Available stock: {selectedProduct?.stock}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Select Hotel</Label>
                <select
                  value={consignHotelId}
                  onChange={(e) => setConsignHotelId(e.target.value)}
                  className="w-full px-3 py-3 rounded-md border border-input bg-background text-base"
                >
                  <option value="">Choose a hotel...</option>
                  {hotels.filter((h) => h.status === "active").map((h) => (
                    <option key={h.id} value={h.id.toString()}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Quantity</Label>
                <Input type="number" placeholder="Enter quantity" value={consignQty} onChange={(e) => setConsignQty(e.target.value)} className="text-base py-6" />
              </div>
            </div>
            <DialogFooter>
              <Button size="lg" onClick={handleConsign} className="text-base py-6 px-8 w-full">
                Consign Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search products by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-base py-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Product Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">SKU</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Stock</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Price</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-4 px-4 font-medium">{p.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{p.sku}</td>
                      <td className="py-4 px-4 font-semibold">{p.stock}</td>
                      <td className="py-4 px-4">{p.price}</td>
                      <td className="py-4 px-4"><StatusBadge status={p.status} /></td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-10 px-3 text-sm" onClick={() => openConsignDialog(p.id)} disabled={p.stock === 0}>
                            <Building2 className="h-4 w-4 mr-1" /> Consign
                          </Button>
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
              {filtered.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No products found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Products;