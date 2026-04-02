"use client";

import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Building2, Plus, Package } from "lucide-react";
import { useState } from "react";
import { useInventory } from "@/contexts/use-inventory";
import { toast } from "sonner";

const HotelInventory = () => {
  const { hotels, products, consignments, addConsignment, getHotelInventory } = useInventory();
  const [selectedHotel, setSelectedHotel] = useState("all");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignProductId, setAssignProductId] = useState("");
  const [assignHotelId, setAssignHotelId] = useState("");
  const [assignQty, setAssignQty] = useState("");

  const inventory = selectedHotel === "all"
    ? getHotelInventory()
    : getHotelInventory(parseInt(selectedHotel));

  const handleAssign = () => {
    if (!assignProductId || !assignHotelId || !assignQty) {
      toast.error("Please fill in all fields");
      return;
    }
    const qty = parseInt(assignQty);
    const product = products.find((p) => p.id === parseInt(assignProductId));
    if (product && qty > product.stock) {
      toast.error("Quantity exceeds available stock");
      return;
    }
    const hotel = hotels.find((h) => h.id === parseInt(assignHotelId));
    addConsignment(parseInt(assignProductId), parseInt(assignHotelId), qty);
    toast.success(`${qty} units of ${product?.name} assigned to ${hotel?.name}`);
    setAssignOpen(false);
    setAssignProductId("");
    setAssignHotelId("");
    setAssignQty("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              Hotel Inventory
            </h1>
            <p className="text-muted-foreground">Track product stock levels across hotels</p>
          </div>
          <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-base py-6 px-8">
                <Plus className="mr-2 h-5 w-5" />
                Assign Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Package className="h-5 w-5" /> Assign Product to Hotel
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label className="text-base">Select Product</Label>
                  <select
                    value={assignProductId}
                    onChange={(e) => setAssignProductId(e.target.value)}
                    className="w-full px-3 py-3 rounded-md border border-input bg-background text-base"
                  >
                    <option value="">Choose a product...</option>
                    {products.filter((p) => p.stock > 0).map((p) => (
                      <option key={p.id} value={p.id.toString()}>
                        {p.name} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Select Hotel</Label>
                  <select
                    value={assignHotelId}
                    onChange={(e) => setAssignHotelId(e.target.value)}
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
                  <Input type="number" placeholder="Enter quantity" value={assignQty} onChange={(e) => setAssignQty(e.target.value)} className="text-base py-6" />
                </div>
              </div>
              <DialogFooter>
                <Button size="lg" onClick={handleAssign} className="text-base py-6 px-8 w-full">
                  Assign Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Filter by Hotel
              </CardTitle>
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="w-full sm:w-[280px] px-3 py-3 rounded-md border border-input bg-background text-base"
              >
                <option value="all">All Hotels</option>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id.toString()}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Product</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Hotel</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Current Stock</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Min. Required</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-4 px-4 font-medium">{item.product}</td>
                      <td className="py-4 px-4 text-muted-foreground">{item.hotel}</td>
                      <td className="py-4 px-4 font-semibold">{item.stock}</td>
                      <td className="py-4 px-4">{item.minStock}</td>
                      <td className="py-4 px-4"><StatusBadge status={item.status} /></td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">No consigned products found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HotelInventory;