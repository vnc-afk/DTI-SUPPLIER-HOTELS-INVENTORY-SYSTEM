"use client";

import { useState } from "react";
import { Plus, Search, UserCheck, UserX, Users as UsersIcon } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  status: string;
};

function UsersContent() {
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } = useFetch<UserRow[]>("/api/users");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"supplier" | "hotel" | "admin">("supplier");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("Password123!");
  const [saving, setSaving] = useState(false);

  const filtered = (data || []).filter(
    (user: UserRow) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.company.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async () => {
    setSaving(true);
    try {
      await api.users.create({ name, email, role, company, password }, "");
      setName("");
      setEmail("");
      setCompany("");
      setPassword("Password123!");
      setShowForm(false);
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (userId: string) => {
    await api.users.toggleStatus(userId, "");
    await refetch();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading users...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          Failed to load users.
        </div>
      </DashboardLayout>
    );
  }

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
          <Button size="lg" className="px-8 py-6 text-base" onClick={() => setShowForm((value) => !value)}>
            <Plus className="mr-2 h-5 w-5" />
            {showForm ? "Close Form" : "Add User"}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Create User</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} />
              <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <Input placeholder="Company" value={company} onChange={(event) => setCompany(event.target.value)} />
              <Input placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <Input placeholder="Role (supplier, hotel, admin)" value={role} onChange={(event) => setRole(event.target.value as "supplier" | "hotel" | "admin")} />
              <div className="flex items-end">
                <Button className="w-full" onClick={handleCreate} disabled={saving}>
                  {saving ? "Saving..." : "Create User"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                  {filtered.map((user: { id: string; name: string; email: string; role: string; company: string; status: string }) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 font-medium">{user.name}</td>
                      <td className="px-4 py-4 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-4">{user.role}</td>
                      <td className="px-4 py-4">{user.company}</td>
                      <td className="px-4 py-4"><StatusBadge status={user.status as "active" | "inactive"} /></td>
                      <td className="px-4 py-4">
                        <Button variant="outline" size="sm" className="h-10 px-4" onClick={() => toggleStatus(user.id)}>
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