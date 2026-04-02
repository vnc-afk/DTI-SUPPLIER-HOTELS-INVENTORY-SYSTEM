"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const hotels = ["All Hotels", "Grand Plaza Hotel", "Seaside Resort", "Mountain View Inn", "City Center Hotel"];

const inventoryData = [
  { product: "Premium Shampoo 500ml", hotel: "Grand Plaza Hotel", stock: 45, minStock: 20, status: "sufficient" as const },
  { product: "Bath Soap Set", hotel: "Grand Plaza Hotel", stock: 8, minStock: 15, status: "low" as const },
  { product: "Hand Towels (6pc)", hotel: "Seaside Resort", stock: 30, minStock: 10, status: "sufficient" as const },
  { product: "Shower Gel 250ml", hotel: "Seaside Resort", stock: 5, minStock: 20, status: "low" as const },
  { product: "Dental Kit", hotel: "Mountain View Inn", stock: 60, minStock: 25, status: "sufficient" as const },
  { product: "Body Lotion 300ml", hotel: "Mountain View Inn", stock: 3, minStock: 10, status: "low" as const },
  { product: "Slippers (Pair)", hotel: "City Center Hotel", stock: 40, minStock: 15, status: "sufficient" as const },
  { product: "Conditioner 500ml", hotel: "City Center Hotel", stock: 12, minStock: 10, status: "sufficient" as const },
];

function HotelInventoryContent() {
  const [selectedHotel, setSelectedHotel] = useState("All Hotels");
  const filtered = selectedHotel === "All Hotels" ? inventoryData : inventoryData.filter((item) => item.hotel === selectedHotel);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1>Hotel Inventory</h1>
          <p className="text-muted-foreground">Track product stock levels across hotels</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Filter by Hotel
              </CardTitle>
              <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                <SelectTrigger className="w-full text-base py-6 sm:w-[280px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel} value={hotel} className="py-3 text-base">
                      {hotel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Product</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Hotel</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Current Stock</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Min. Required</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 font-medium">{item.product}</td>
                      <td className="px-4 py-4 text-muted-foreground">{item.hotel}</td>
                      <td className="px-4 py-4 font-semibold">{item.stock}</td>
                      <td className="px-4 py-4">{item.minStock}</td>
                      <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
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

export default function HotelInventoryPage() {
  return (
    <RoleGate allowedRoles={["supplier"]}>
      <HotelInventoryContent />
    </RoleGate>
  );
}