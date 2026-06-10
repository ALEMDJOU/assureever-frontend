"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Users, Stethoscope, Banknote, FileHeart,
  TrendingUp, ArrowRight, CheckCircle2, Clock,
} from "lucide-react";
import { useAssures, useMedecins } from "@/hooks/useApi";

const recentConsultations = [
  { name: "Amina El Idrissi",   type: "Médecin généraliste",        date: "12/05/2024", taux: "100%", statut: "Remboursé" },
  { name: "Youssef Maaroufi",   type: "Spécialiste — Cardiologie",  date: "10/05/2024", taux: "80%",  statut: "Remboursé" },
  { name: "Fatima Zahra Alaoui",type: "Médecin généraliste",        date: "09/05/2024", taux: "100%", statut: "Remboursé" },
  { name: "Mehdi Benkran",      type: "Spécialiste — Ophtalmologie",date: "08/05/2024", taux: "80%",  statut: "En attente" },
];

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

      {/* Consultations récentes */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-navy text-sm">Consultations récentes</h2>
          <Link href="#" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Patient", "Type", "Date", "Taux", "Statut"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentConsultations.map((c) => (
              <tr key={c.name} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <span className="font-medium text-navy text-sm">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-text-secondary text-xs">{c.type}</td>
                <td className="px-4 py-3.5 text-text-secondary text-xs">{c.date}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    c.taux === "100%" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {c.taux}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                    c.statut === "Remboursé" ? "text-green-600" : "text-amber-600"
                  }`}>
                    {c.statut === "Remboursé"
                      ? <CheckCircle2 className="w-3.5 h-3.5" />
                      : <Clock className="w-3.5 h-3.5" />}
                    {c.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
