"use client";

import {
  Package, BarChart3, CreditCard, AlertTriangle, Building2,
  Users, ShieldCheck, FileText, ClipboardList, ShoppingCart,
  DollarSign, TrendingUp, LayoutDashboard, LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useRouter } from "next/navigation";
import { useRole } from "@/contexts/RoleContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const supplierNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Hotel Inventory", url: "/hotel-inventory", icon: Building2 },
  { title: "Low-Stock Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Sales Reports", url: "/sales-reports", icon: BarChart3 },
  { title: "Payments", url: "/payments", icon: CreditCard },
];

const hotelNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Consignment", url: "/consignment", icon: ClipboardList },
  { title: "Record Sale", url: "/record-sale", icon: ShoppingCart },
  { title: "Sales Reports", url: "/sales-reports", icon: BarChart3 },
  { title: "Payments", url: "/payments", icon: DollarSign },
];

const adminNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Users & Suppliers", url: "/users", icon: Users },
  { title: "Sales Monitoring", url: "/sales-monitoring", icon: TrendingUp },
  { title: "Product Performance", url: "/product-performance", icon: BarChart3 },
  { title: "Payment Compliance", url: "/payment-compliance", icon: ShieldCheck },
  { title: "Audit Logs", url: "/audit-logs", icon: FileText },
];

const navMap: Record<string, NavItem[]> = {
  supplier: supplierNav,
  hotel: hotelNav,
  admin: adminNav,
};

const roleLabels: Record<string, string> = {
  supplier: "Supplier Portal",
  hotel: "Hotel Portal",
  admin: "DTI Admin",
};

export function AppSidebar() {
  const { role, setRole, userName } = useRole();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const router = useRouter();
  const items = role ? navMap[role] || [] : [];

  const handleLogout = () => {
    setRole(null);
    router.replace("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {!collapsed && (
          <div className="px-4 py-5 border-b border-sidebar-border">
            <p className="text-sm text-sidebar-foreground/70">
              {role ? roleLabels[role] : ""}
            </p>
            <p className="font-semibold text-sidebar-foreground text-lg">
              {userName}
            </p>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-sm uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="py-3 text-base">
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50 rounded-lg px-3 gap-3"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent py-3 text-base"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
