import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Plateforme: [
    { label: "Fonctionnalités",   href: "#fonctionnalites" },
    { label: "Avantages",         href: "#avantages" },
    { label: "Comment ça marche", href: "#apropos" },
    { label: "Tarifs",            href: "#" },
  ],
  "Accès rapide": [
    { label: "Espace médecin",    href: "/auth/login" },
    { label: "Espace assureur",   href: "/auth/assureur" },
    { label: "Créer un compte",   href: "/auth/register" },
    { label: "Documentation",     href: "#" },
  ],
  Légal: [
    { label: "Mentions légales",             href: "#" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "Conditions d'utilisation",     href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* ── Brand ── */}
          <div className="lg:col-span-2">
            {/* Logo + nom */}
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="relative w-11 h-11 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="AssureEver logo"
                  fill
                  className="object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-white text-[19px] tracking-tight">
                  Assure<span className="text-primary-light">ever</span>
                </span>
                <span className="text-[9px] text-white/40 font-medium tracking-widest uppercase mt-0.5">
                  Votre santé, notre engagement
                </span>
              </div>
            </Link>

            <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-xs">
              Plateforme digitale de gestion de la sécurité sociale.
              Sécurisée, transparente et au service des assurés.
            </p>

            <div className="space-y-2.5">
              {[
                { icon: Mail,   text: "contact@assureever.cm" },
                { icon: Phone,  text: "+237 6XX XXX XXX" },
                { icon: MapPin, text: "Yaoundé, Cameroun" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-white/50 text-sm hover:text-white/75 transition-colors cursor-default">
                  <Icon className="w-3.5 h-3.5 text-primary-light shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Liens ── */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-white text-sm mb-4 tracking-wide">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-primary-light text-sm transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bas de footer ── */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo miniature + copyright */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-5 h-5 shrink-0 opacity-50">
              <Image
                src="/images/logo.png"
                alt=""
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <p className="text-white/35 text-sm">
              © {new Date().getFullYear()} AssureEver. Tous droits réservés.
            </p>
          </div>
          <p className="text-white/25 text-xs">
            Projet tutoré 3GI — Conception des Systèmes d&apos;Information
          </p>
        </div>
      </div>
    </footer>
  );
}
