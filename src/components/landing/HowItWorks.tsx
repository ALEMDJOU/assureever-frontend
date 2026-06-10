const steps = [
  {
    step: "01",
    title: "Inscription de l'assuré",
    desc: "L'agent assureur inscrit l'assuré dans le système et lui attribue un numéro unique. Le médecin traitant est enregistré.",
    role: "Assureur",
  },
  {
    step: "02",
    title: "Consultation & prescription",
    desc: "Le médecin enregistre la consultation, rédige les prescriptions médicaments ou oriente vers un spécialiste.",
    role: "Médecin",
  },
  {
    step: "03",
    title: "Feuille de maladie",
    desc: "Le médecin enregistre la feuille de maladie. L'assureur la complète et la valide dans le système.",
    role: "Médecin & Assureur",
  },
  {
    step: "04",
    title: "Remboursement automatique",
    desc: "Le système calcule automatiquement le montant : 100% pour un généraliste, 80% pour un spécialiste. La facture PDF est générée.",
    role: "Assureur",
  },
];

export default function HowItWorks() {
  return (
    <section id="apropos" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-eyebrow mb-4">Comment ça marche</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4 leading-tight">
            Un processus clair,{" "}
            <span className="text-gradient">étape par étape</span>
          </h2>
          <p className="text-text-secondary text-lg">
            De l&apos;inscription à la feuille de remboursement, chaque action
            est guidée et tracée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Ligne de connexion desktop */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map((s, i) => (
            <div key={s.step} className="relative bg-white rounded-2xl p-6 shadow-card border border-gray-100/80 text-center group hover:shadow-card-hover transition-all duration-300">
              {/* Numéro */}
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-lg mx-auto mb-5 ring-4 ring-white shadow-lg shadow-primary/30 relative z-10">
                {s.step}
              </div>
              {/* Rôle */}
              <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                {s.role}
              </span>
              <h3 className="font-bold text-navy text-base mb-3">{s.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
