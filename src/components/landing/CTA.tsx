import Link from "next/link";
import { ArrowRight, UserCog } from "lucide-react";

export default function CTA() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-navy via-navy-light to-primary rounded-3xl p-12 sm:p-16 shadow-2xl relative overflow-hidden">
          {/* Décoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

          <div className="relative z-10">
            <span className="inline-block text-sm font-semibold text-primary-light bg-primary/20 border border-primary/30 px-4 py-1.5 rounded-full mb-6 tracking-wide">
              Rejoignez la plateforme
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
              Prêt à moderniser votre{" "}
              <span className="text-primary-light">gestion de santé ?</span>
            </h2>
            <p className="text-white/65 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Rejoignez les organismes de sécurité sociale qui font confiance
              à AssureEver pour simplifier leurs opérations quotidiennes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/auth/assureur"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/30"
              >
                <UserCog className="w-5 h-5" />
                Espace assureur
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/50 transition-colors"
              >
                Espace médecin
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
