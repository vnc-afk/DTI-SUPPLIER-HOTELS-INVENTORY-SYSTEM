"use client";

import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Building2, MapPin, User } from "lucide-react";
import { useState } from "react";
import { useInventory } from "@/contexts/use-inventory";
import { toast } from "sonner";

const Hotels = () => {
  const { hotels, addHotel } = useInventory();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", contactPerson: "" });

  const filtered = hotels.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.location || !form.contactPerson) {
      toast.error("Please fill in all fields");
      return;
    }
    addHotel({ ...form, status: "active" });
    toast.success(`${form.name} has been added!`);
    setForm({ name: "", location: "", contactPerson: "" });
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              Hotel Management
            </h1>
            <p className="text-muted-foreground">Manage hotels in the system</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-base py-6 px-8">
                <Plus className="mr-2 h-5 w-5" />
                Add Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Building2 className="h-5 w-5" /> Add New Hotel
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label className="text-base">Hotel Name</Label>
                  <Input
                    placeholder="e.g. Grand Plaza Hotel"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="text-base py-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Location</Label>
                  <Input
                    placeholder="e.g. Manila"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="text-base py-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Contact Person</Label>
                  <Input
                    placeholder="e.g. Maria Santos"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="text-base py-6"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button size="lg" onClick={handleAdd} className="text-base py-6 px-8 w-full">
                  <Plus className="mr-2 h-5 w-5" /> Add Hotel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search hotels by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-base py-6"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((h) => (
                <Card key={h.id} className="border-2">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{h.name}</h3>
                      <StatusBadge status={h.status} />
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {h.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" /> {h.contactPerson}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hotels found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Hotels;
