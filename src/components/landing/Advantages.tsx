import { ShieldCheck, Eye, HeartHandshake, Network } from "lucide-react";

const advantages = [
  {
    icon: ShieldCheck,
    title: "Sécurité garantie",
    desc: "Vos données sont protégées avec les plus hauts standards de sécurité et de chiffrement.",
  },
  {
    icon: Eye,
    title: "Transparence totale",
    desc: "Suivi clair et en temps réel de vos remboursements et paiements, sans surprises.",
  },
  {
    icon: HeartHandshake,
    title: "Au service de votre santé",
    desc: "Un accompagnement humain et digital pour simplifier vos démarches administratives.",
  },
  {
    icon: Network,
    title: "Un écosystème connecté",
    desc: "Assurés, médecins et organisme unis pour de meilleurs soins et une meilleure prise en charge.",
  },
];

export default function Advantages() {
  return (
    <section id="avantages" className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light uppercase tracking-widest bg-primary/20 border border-primary/30 px-4 py-1.5 rounded-full mb-4">
            Pourquoi AssureEver
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Conçu pour simplifier{" "}
            <span className="text-primary-light">la gestion de santé</span>
          </h2>
          <p className="text-white/60 text-lg">
            Chaque fonctionnalité a été pensée pour réduire la complexité
            administrative et améliorer l&apos;expérience de chaque acteur.
          </p>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-5">
                <item.icon className="w-6 h-6 text-primary-light" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
