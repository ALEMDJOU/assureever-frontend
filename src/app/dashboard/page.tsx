import {
  Users, Stethoscope, CalendarCheck, Banknote,
  TrendingUp, ArrowRight, Bell, CheckCircle2
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Assurés",              value: "25 680",  icon: Users,         color: "text-blue-600",  bg: "bg-blue-50" },
  { label: "Médecins",             value: "1 245",   icon: Stethoscope,   color: "text-teal-600",  bg: "bg-teal-50" },
  { label: "Consultations ce mois",value: "8 923",   icon: CalendarCheck, color: "text-indigo-600",bg: "bg-indigo-50" },
  { label: "Montant remboursé",    value: "2,45 M",  icon: Banknote,      color: "text-green-600", bg: "bg-green-50" },
];

const recentConsultations = [
  { name: "Amina El Idrissi",  type: "Médecin généraliste",    date: "12/05/2024", taux: "100%", status: "Remboursé" },
  { name: "Youssef Maaroufi",  type: "Spécialiste - Cardiologie", date: "10/05/2024", taux: "80%",  status: "Remboursé" },
  { name: "Fatima Zahra Alaoui",type: "Médecin généraliste",   date: "09/05/2024", taux: "100%", status: "Remboursé" },
  { name: "Mehdi Benkran",     type: "Spécialiste - Ophtalmologie", date: "08/05/2024", taux: "80%", status: "En attente" },
];

const navItems = [
  { label: "Tableau de bord", href: "/dashboard",         active: true },
  { label: "Assurés",        href: "/dashboard/assures",  active: false },
  { label: "Médecins",       href: "/dashboard/medecins", active: false },
  { label: "Consultations",  href: "#",                   active: false },
  { label: "Feuilles de maladie", href: "#",              active: false },
  { label: "Prescriptions",  href: "#",                   active: false },
  { label: "Remboursements", href: "#",                   active: false },
  { label: "Paiements",      href: "#",                   active: false },
  { label: "Rapports",       href: "#",                   active: false },
  { label: "Paramètres",     href: "#",                   active: false },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0 hidden lg:flex">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-navy text-base">
            Assure<span className="text-primary">ever</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
                item.active
                  ? "text-primary bg-primary/8 border-r-2 border-primary"
                  : "text-text-secondary hover:text-primary hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              KB
            </div>
            <div>
              <p className="text-xs font-semibold text-navy">Karim Benali</p>
              <p className="text-xs text-text-muted">Assureur</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-navy text-lg">Tableau de bord</h1>
            <p className="text-xs text-text-muted">Bienvenue, Karim Benali</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              KB
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-extrabold text-navy">{s.value}</p>
                <p className="text-xs text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Consultations récentes */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-navy text-base">Consultations récentes</h2>
              <Link href="#" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Voir toutes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Patient</th>
                    <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Type</th>
                    <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Date</th>
                    <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Taux</th>
                    <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentConsultations.map((c) => (
                    <tr key={c.name} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <span className="font-medium text-navy">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-text-secondary">{c.type}</td>
                      <td className="py-3.5 text-text-secondary">{c.date}</td>
                      <td className="py-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.taux === "100%"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          Remboursé {c.taux}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          c.status === "Remboursé" ? "text-green-600" : "text-amber-600"
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Répartition remboursements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <h2 className="font-bold text-navy text-base mb-4">Répartition des remboursements</h2>
              <div className="flex items-center gap-6">
                {/* Donut simulé en CSS */}
                <div className="w-24 h-24 rounded-full shrink-0" style={{
                  background: "conic-gradient(#0e7c6b 0% 59%, #3b82f6 59% 100%)"
                }} />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
                    <span className="text-text-secondary">Généralistes (100%)</span>
                    <span className="font-bold text-navy ml-auto">1,45 M</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-text-secondary">Spécialistes (80%)</span>
                    <span className="font-bold text-navy ml-auto">1,00 M</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <span className="font-bold text-navy">Total : 2,45 M FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <h2 className="font-bold text-navy text-base mb-4">Remboursement par mode de paiement</h2>
              <div className="space-y-4">
                {[
                  { label: "Virement bancaire", pct: 70, color: "bg-primary" },
                  { label: "Espèces",           pct: 30, color: "bg-blue-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-text-secondary font-medium">{item.label}</span>
                      <span className="font-bold text-navy">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
