"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, Users, Stethoscope, FileHeart,
  ClipboardList, Banknote, Bell, Shield,
  LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Tableau de bord",    href: "/dashboard",                      icon: LayoutDashboard, roles: ["ASSUREUR", "MEDECIN"] },
  { label: "Assurés",            href: "/dashboard/assures",              icon: Users,           roles: ["ASSUREUR"] },
  { label: "Médecins",           href: "/dashboard/medecins",             icon: Stethoscope,     roles: ["ASSUREUR"] },
  { label: "Feuilles de maladie",href: "/dashboard/feuilles-maladie",     icon: FileHeart,       roles: ["ASSUREUR", "MEDECIN"] },
  { label: "Prescriptions",      href: "/dashboard/prescriptions",        icon: ClipboardList,   roles: ["MEDECIN"] },
  { label: "Remboursements",     href: "/dashboard/remboursements",       icon: Banknote,        roles: ["ASSUREUR"] },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname  = usePathname();
  const { data: session } = useSession();
  const role      = (session?.user as any)?.role as string | undefined;
  const userName  = session?.user?.name ?? "Utilisateur";
  const userEmail = session?.user?.email ?? "";

  const visibleNav = navItems.filter((item) => !role || item.roles.includes(role));

  const Sidebar = (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100 w-56 shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-navy text-base tracking-tight">
          Assure<span className="text-primary">ever</span>
        </span>
      </div>

      {/* Rôle badge */}
      <div className="px-4 py-2.5 mx-3 mt-3 rounded-lg bg-primary/8 border border-primary/15">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide">
          {role === "ASSUREUR" ? "Agent assureur" : role === "MEDECIN" ? "Médecin" : "Utilisateur"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto px-2">
        {visibleNav.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-gray-50 hover:text-navy"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "text-text-muted")} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-navy truncate">{userName}</p>
            <p className="text-xs text-text-muted truncate">{userEmail}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40">
        {Sidebar}
      </div>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-56 animate-fade-in">
            {Sidebar}
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:pl-56 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 text-text-secondary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4 text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
