"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Play, ShieldCheck, BadgeCheck, Users, ChevronDown } from "lucide-react";

const stats = [
  { value: "25 680", label: "Assurés actifs" },
  { value: "1 245",  label: "Médecins" },
  { value: "8 923",  label: "Consultations / mois" },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Petit délai pour déclencher les animations après le montage
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Background image ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/stage.jpg')" }}
      />
      {/* Overlay principal — allégé pour laisser respirer l'image */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/55 to-navy/15" />
      {/* Overlay bas — transition douce */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-navy/40 to-transparent" />

      {/* ── Contenu principal ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-32">
          <div className="max-w-[620px]">

            {/* Eyebrow */}
            <div
              className={`inline-flex items-center gap-2 bg-primary/25 border border-primary/40 text-primary-light px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-7 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Plateforme digitale de gestion de la santé
            </div>

            {/* Headline */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.08] tracking-tight mb-6 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              Une gestion de santé
              <span className="block mt-1">plus simple, plus sûre,</span>
              <span className="block mt-1 text-primary-light">plus humaine.</span>
            </h1>

            {/* Sous-titre */}
            <p
              className={`text-[17px] text-white/70 leading-relaxed mb-10 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              AssureEver centralise la gestion des assurés, des médecins,
              des consultations et des remboursements pour un service
              efficace, transparent et sécurisé.
            </p>

            {/* CTA */}
            <div
              className={`flex flex-wrap gap-3 mb-14 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-[15px] px-7 py-3.5 rounded-xl hover:bg-primary-light transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Découvrir AssureEver
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold text-[15px] px-7 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                Voir la démo
              </button>
            </div>

            {/* Trust badges */}
            <div
              className={`flex flex-wrap gap-5 transition-all duration-700 delay-[400ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {[
                { icon: ShieldCheck, text: "Données sécurisées" },
                { icon: BadgeCheck,  text: "Conforme & fiable" },
                { icon: Users,       text: "Au service des assurés" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/65 text-sm font-medium">
                  <Icon className="w-4 h-4 text-primary-light shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats flottantes ── */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="flex flex-wrap gap-3 lg:justify-end">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-3.5 min-w-[120px]"
            >
              <span className="text-2xl font-extrabold text-white tracking-tight">{s.value}</span>
              <span className="text-[11px] text-white/55 font-medium mt-0.5 whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Vague de transition ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
          <path d="M0 72L1440 72L1440 28C1320 58 1080 8 720 36C360 64 120 14 0 44L0 72Z" fill="white" />
        </svg>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-1 animate-bounce">
        <span className="text-white/30 text-[10px] uppercase tracking-widest font-medium">Défiler</span>
        <ChevronDown className="w-4 h-4 text-white/30" />
      </div>
    </section>
  );
}
