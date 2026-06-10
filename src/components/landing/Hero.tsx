import Link from "next/link";
import { ArrowRight, Play, ShieldCheck, BadgeCheck, Users } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Background image avec overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/stage.jpg')" }}
      />
      {/* Overlay dégradé — laisse transparaître l'image à droite */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/75 to-navy/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/40" />

      {/* Contenu */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-light px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-8 animate-fade-in-up">
            <ShieldCheck className="w-4 h-4" />
            Plateforme digitale de gestion de la santé
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 animate-fade-in-up animate-delay-100">
            Une gestion de santé{" "}
            <span className="block">plus simple, plus sûre,</span>
            <span className="block text-primary-light">plus humaine.</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-xl animate-fade-in-up animate-delay-200">
            AssureEver centralise la gestion des assurés, des médecins,
            des consultations et des remboursements pour un service
            efficace, transparent et sécurisé.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 mb-14 animate-fade-in-up animate-delay-300">
            <Link href="/dashboard" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-primary/30">
              Découvrir AssureEver
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn-outline border-white/40 text-white hover:bg-white/10 hover:border-white/60 text-base px-8 py-3.5">
              <Play className="w-4 h-4 fill-current" />
              Voir la démo
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 animate-fade-in-up animate-delay-400">
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 text-primary-light" />
              Données sécurisées
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <BadgeCheck className="w-5 h-5 text-primary-light" />
              Conforme &amp; fiable
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <Users className="w-5 h-5 text-primary-light" />
              Au service des assurés
            </div>
          </div>
        </div>

        {/* Stats flottantes en bas à droite */}
        <div className="absolute bottom-12 right-8 hidden lg:flex gap-4">
          {[
            { value: "25 680", label: "Assurés actifs" },
            { value: "1 245",  label: "Médecins" },
            { value: "8 923",  label: "Consultations / mois" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="stat-badge text-center"
            >
              <span className="text-xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-white/60 mt-0.5 whitespace-nowrap">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vague de transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 20C1200 60 720 0 0 40L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
