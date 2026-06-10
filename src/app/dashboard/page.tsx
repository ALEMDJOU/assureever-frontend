"use client";

import { useSession } from "next-auth/react";
import DashboardAssureur from "@/components/dashboard/DashboardAssureur";
import DashboardMedecin  from "@/components/dashboard/DashboardMedecin";

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;

  if (role === "MEDECIN")   return <DashboardMedecin />;
  if (role === "ASSUREUR")  return <DashboardAssureur />;

  // Chargement / rôle inconnu
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
