"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FileHeart, ClipboardList, Stethoscope,
  ArrowRight, Pill, UserCheck,
} from "lucide-react";

export default function DashboardMedecin() {
  const { data: session } = useSession();
  const prenom = session?.user?.name?.split(" ")[0] ?? "Docteur";

  const actions = [
    {
      href:  "/dashboard/feuilles-maladie",
      icon:  FileHeart,
      label: "Enregistrer une feuille de maladie",
      desc:  "Créer une feuille pour un de vos patients",
      color: "bg-teal-50 text-teal-600",
    },
    {
      href:  "/dashboard/prescriptions",
      icon:  Pill,
      label: "Prescrire un médicament",
      desc:  "Rédiger une ordonnance médicamenteuse",
      color: "bg-blue-50 text-blue-600",
    },
    {
      href:  "/dashboard/prescriptions",
      icon:  UserCheck,
      label: "Orienter vers un spécialiste",
      desc:  "Prescrire une consultation spécialisée",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div>
        <h1 className="text-xl font-bold text-navy">Bonjour, Dr. {prenom}</h1>
        <p className="text-text-muted text-sm mt-0.5">Tableau de bord — Espace médecin</p>
      </div>

      {/* Rappel rôle */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shrink-0 mt-0.5">
          <Stethoscope className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-teal-800">Espace médecin</p>
          <p className="text-xs text-teal-700 mt-0.5 leading-relaxed">
            Vous pouvez enregistrer des feuilles de maladie, prescrire des médicaments
            et orienter vos patients vers des spécialistes.
          </p>
        </div>
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="font-bold text-navy text-sm mb-3">Actions disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((item) => (
            <Link key={item.label} href={item.href}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-card-hover hover:border-primary/20 transition-all group">
              <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                <item.icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-navy text-sm group-hover:text-primary transition-colors leading-tight">{item.label}</p>
              <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{item.desc}</p>
              <div className="flex items-center gap-1 text-xs text-primary font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Accéder <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Liens rapides */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="font-bold text-navy text-sm mb-4">Accès rapides</h2>
        <div className="space-y-2">
          {[
            { href: "/dashboard/feuilles-maladie", icon: FileHeart,    label: "Mes feuilles de maladie" },
            { href: "/dashboard/prescriptions",    icon: ClipboardList, label: "Mes prescriptions" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <item.icon className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              <span className="text-sm text-text-secondary group-hover:text-navy transition-colors">{item.label}</span>
              <ArrowRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
