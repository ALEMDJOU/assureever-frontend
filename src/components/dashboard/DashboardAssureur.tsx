"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Users, Stethoscope, Banknote, FileHeart,
  TrendingUp, ArrowRight, CheckCircle2, Clock,
} from "lucide-react";
import { useAssures, useMedecins } from "@/hooks/useApi";



export default function DashboardAssureur() {
  const { data: session }  = useSession();
  const { data: assures }  = useAssures(1, 1);
  const { data: medecins } = useMedecins();
  const prenom = session?.user?.name?.split(" ")[0] ?? "Assureur";

  const stats = [
    { label: "Assurés inscrits",    value: assures?.total ?? "—",  icon: Users,       color: "text-blue-600",  bg: "bg-blue-50" },
    { label: "Médecins enregistrés",value: medecins?.total ?? "—", icon: Stethoscope, color: "text-teal-600",  bg: "bg-teal-50" },
    { label: "Remboursements",      value: "—",                    icon: Banknote,    color: "text-green-600", bg: "bg-green-50" },
    { label: "Feuilles en attente", value: "—",                    icon: FileHeart,   color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div>
        <h1 className="text-xl font-bold text-navy">Bonjour, {prenom}</h1>
        <p className="text-text-muted text-sm mt-0.5">Tableau de bord — Espace assureur</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-extrabold text-navy">{String(s.value)}</p>
            <p className="text-xs text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Accès rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/assures",        icon: Users,       label: "Inscrire un assuré",      color: "bg-blue-50 text-blue-600" },
          { href: "/dashboard/medecins",        icon: Stethoscope, label: "Enregistrer un médecin",  color: "bg-teal-50 text-teal-600" },
          { href: "/dashboard/remboursements",  icon: Banknote,    label: "Effectuer un remboursement", color: "bg-green-50 text-green-600" },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 hover:shadow-card-hover hover:border-primary/20 transition-all group">
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-navy group-hover:text-primary transition-colors">{item.label}</span>
            <ArrowRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

    </div>
  );
}
