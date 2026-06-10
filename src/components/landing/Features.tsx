import {
  Users,
  Stethoscope,
  ClipboardList,
  FileHeart,
  Banknote,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestion des assurés",
    desc: "Inscription et gestion des profils des assurés et de leurs informations médicales.",
    accent: "from-teal-400/20 to-teal-600/10",
  },
  {
    icon: Stethoscope,
    title: "Gestion des médecins",
    desc: "Répertoire des médecins généralistes et spécialistes et gestion des consultations.",
    accent: "from-blue-400/20 to-blue-600/10",
  },
  {
    icon: ClipboardList,
    title: "Consultations & prescriptions",
    desc: "Suivi des consultations, prescriptions de médicaments et d'orientations vers les spécialistes.",
    accent: "from-emerald-400/20 to-emerald-600/10",
  },
  {
    icon: FileHeart,
    title: "Feuilles de maladie",
    desc: "Enregistrement des feuilles de maladie par tous les médecins en toute simplicité.",
    accent: "from-cyan-400/20 to-cyan-600/10",
  },
  {
    icon: Banknote,
    title: "Remboursements",
    desc: "100% pour les généralistes, 80% pour les spécialistes. Remboursement par virement ou en espèces.",
    accent: "from-green-400/20 to-green-600/10",
  },
  {
    icon: Lock,
    title: "Sécurité & confidentialité",
    desc: "Protection maximale des données médicales et respect de la confidentialité des patients.",
    accent: "from-indigo-400/20 to-indigo-600/10",
  },
];

export default function Features() {
  return (
    <section id="fonctionnalites" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-eyebrow mb-4">Fonctionnalités</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4 leading-tight">
            Tout ce dont vous avez besoin,{" "}
            <span className="text-gradient">en un seul endroit</span>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Une plateforme pensée pour les organismes de sécurité sociale,
            les médecins et les assurés — ergonomique, sécurisée et évolutive.
          </p>
        </div>

        {/* Grille de cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="feature-card group">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center mb-4`}
              >
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-navy text-lg mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
