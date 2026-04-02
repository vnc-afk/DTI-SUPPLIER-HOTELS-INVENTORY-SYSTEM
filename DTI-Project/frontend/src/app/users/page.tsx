"use client";

import { useState } from "react";
import { Plus, Search, UserCheck, UserX, Users as UsersIcon } from "lucide-react";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const usersData = [
  { id: 1, name: "Maria Santos", email: "maria@cleanco.ph", role: "Supplier", company: "CleanCo Supplies", status: "active" as const },
  { id: 2, name: "Juan Reyes", email: "juan@grandplaza.ph", role: "Hotel", company: "Grand Plaza Hotel", status: "active" as const },
  { id: 3, name: "Ana Cruz", email: "ana@textilepro.ph", role: "Supplier", company: "TextilePro Inc.", status: "active" as const },
  { id: 4, name: "Carlos Lim", email: "carlos@seaside.ph", role: "Hotel", company: "Seaside Resort", status: "inactive" as const },
  { id: 5, name: "Rosa Dela Cruz", email: "rosa@mountainview.ph", role: "Hotel", company: "Mountain View Inn", status: "active" as const },
  { id: 6, name: "Pedro Reyes", email: "pedro@hotelessen.ph", role: "Supplier", company: "HotelEssentials", status: "inactive" as const },
  { id: 7, name: "Lisa Garcia", email: "lisa@citycenter.ph", role: "Hotel", company: "City Center Hotel", status: "active" as const },
];

function UsersContent() {
  const [search, setSearch] = useState("");
  const filtered = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.company.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3">
              <UsersIcon className="h-8 w-8" />
              Users & Suppliers
            </h1>
            <p className="text-muted-foreground">Manage all registered users and suppliers</p>
          </div>
          <Button size="lg" className="px-8 py-6 text-base">
            <Plus className="mr-2 h-5 w-5" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or company..."
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
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Name</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Email</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Role</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Company</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 font-medium">{user.name}</td>
                      <td className="px-4 py-4 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-4">{user.role}</td>
                      <td className="px-4 py-4">{user.company}</td>
                      <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
                      <td className="px-4 py-4">
                        <Button variant="outline" size="sm" className="h-10 px-4">
                          {user.status === "active" ? (
                            <><UserX className="mr-2 h-4 w-4" />Deactivate</>
                          ) : (
                            <><UserCheck className="mr-2 h-4 w-4" />Activate</>
                          )}
                        </Button>
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

export default function UsersRoutePage() {
  return (
    <RoleGate allowedRoles={["admin"]}>
      <UsersContent />
    </RoleGate>
  );
}