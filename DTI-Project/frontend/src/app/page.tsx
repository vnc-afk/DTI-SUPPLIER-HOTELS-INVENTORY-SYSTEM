"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, ShieldCheck, Truck } from "lucide-react";
import { useRole } from "@/contexts/use-role";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const roles = [
  {
    id: "supplier" as const,
    title: "Supplier",
    description: "Manage products, track hotel inventory, and view sales reports",
    icon: Truck,
    color: "bg-primary",
  },
  {
    id: "hotel" as const,
    title: "Hotel",
    description: "View consignment products, record sales, and submit payments",
    icon: Building2,
    color: "bg-success",
  },
  {
    id: "admin" as const,
    title: "DTI Admin",
    description: "Monitor all activity, manage users, and ensure compliance",
    icon: ShieldCheck,
    color: "bg-accent",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { role, setRole } = useRole();

  useEffect(() => {
    if (role) {
      router.replace("/dashboard");
    }
  }, [role, router]);

  const handleSelect = (roleId: "supplier" | "hotel" | "admin") => {
    setRole(roleId);
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.16),_transparent_30%),radial-gradient(circle_at_top_right,_hsl(var(--accent)/0.18),_transparent_24%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--background))_100%)] px-6 py-10">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,hsl(var(--border)/0.55)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.55)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col items-center justify-center">
        <div className="mb-12 max-w-2xl space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">DTI Supplier Hotel Portal</p>
          <h1 className="text-4xl text-foreground md:text-6xl">Inventory Monitoring System</h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Select your role to get started. Each portal is tailored to your needs.
          </p>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {roles.map((roleItem) => (
            <Card
              key={roleItem.id}
              className="border-border/70 bg-card/90 shadow-[0_18px_50px_-28px_hsl(var(--foreground)/0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_28px_70px_-32px_hsl(var(--primary)/0.45)]"
            >
              <CardContent className="space-y-5 p-8 text-center">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${roleItem.color}`}>
                  <roleItem.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-foreground">{roleItem.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{roleItem.description}</p>
                </div>
                <Button size="lg" className="w-full py-6 text-base" onClick={() => handleSelect(roleItem.id)}>
                  Enter {roleItem.title} Portal
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}