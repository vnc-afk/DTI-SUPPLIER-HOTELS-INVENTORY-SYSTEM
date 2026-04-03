"use client";

import { useState } from "react";
import { FileText, Search } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { RoleGate } from "@/layout/RoleGate";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuditLogRow = {
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: string;
};

const typeColors: Record<string, string> = {
  create: "bg-success/15 text-success",
  sale: "bg-primary/15 text-primary",
  alert: "bg-destructive/15 text-destructive",
  update: "bg-accent/15 text-accent-foreground",
  payment: "bg-warning/15 text-warning",
  admin: "bg-muted text-muted-foreground",
  system: "bg-secondary text-secondary-foreground",
};

function AuditLogsContent() {
  const [search, setSearch] = useState("");
  const { data, loading, error } = useFetch<AuditLogRow[]>("/api/audit-logs");

  const filtered = (data || []).filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading audit logs...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          Failed to load audit logs.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground">Complete activity history across the system</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, action, or details..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="py-6 text-base"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b">
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Timestamp</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">User</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Action</th>
                    <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, index) => (
                    <tr key={`${log.timestamp}-${index}`} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 whitespace-nowrap font-mono text-sm text-muted-foreground">{log.timestamp}</td>
                      <td className="px-4 py-4 font-medium">{log.user}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${typeColors[log.type] || typeColors.system}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{log.details}</td>
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

export default function AuditLogsPage() {
  return (
    <RoleGate allowedRoles={["admin"]}>
      <AuditLogsContent />
    </RoleGate>
  );
}