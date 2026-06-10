"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Shield, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Accueil",         href: "#accueil" },
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Avantages",       href: "#avantages" },
  { label: "Comment ça marche", href: "#apropos" },
  { label: "Contact",         href: "#contact" },
];

export default function Navbar() {
  const [open,        setOpen]       = useState(false);
  const [scrolled,    setScrolled]   = useState(false);
  const [active,      setActive]     = useState("Accueil");
  const [loginOpen,   setLoginOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer le dropdown connexion en cliquant ailleurs
  useEffect(() => {
    if (!loginOpen) return;
    const close = () => setLoginOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [loginOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-light transition-colors duration-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-navy text-[17px] tracking-tight">
                Assure<span className="text-primary">ever</span>
              </span>
              <span className="text-[9px] text-text-muted font-medium tracking-widest uppercase mt-0.5">
                Votre santé, notre engagement
              </span>
            </div>
          </Link>

          {/* ── Nav desktop ── */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className={cn(
                    "relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-150 rounded-lg",
                    active === link.label
                      ? "text-primary bg-primary/5"
                      : "text-text-secondary hover:text-navy hover:bg-gray-50"
                  )}
                >
                  {link.label}
                  {active === link.label && (
                    <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-primary rounded-full" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Actions desktop ── */}
          <div className="hidden lg:flex items-center gap-2">

            {/* Dropdown "Se connecter" */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLoginOpen(!loginOpen)}
                className={cn(
                  "flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-2 rounded-lg transition-all duration-150",
                  loginOpen
                    ? "text-primary bg-primary/5"
                    : "text-text-secondary hover:text-navy hover:bg-gray-50"
                )}
              >
                Se connecter
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", loginOpen && "rotate-180")} />
              </button>

              {loginOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                  <Link
                    href="/auth/login"
                    onClick={() => setLoginOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <span className="text-blue-600 text-xs font-bold">M</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy group-hover:text-primary transition-colors">Espace médecin</p>
                      <p className="text-xs text-text-muted">Connectez-vous ici</p>
                    </div>
                  </Link>
                  <div className="h-px bg-gray-100 mx-3" />
                  <Link
                    href="/auth/assureur"
                    onClick={() => setLoginOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs font-bold">A</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy group-hover:text-primary transition-colors">Espace assureur</p>
                      <p className="text-xs text-text-muted">Accès restreint</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* CTA principal */}
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-primary-light transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Demander un accès
            </Link>
          </div>

          {/* ── Burger mobile ── */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-gray-50 transition-colors"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Menu mobile ── */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 pb-4 pt-2 animate-fade-in">
            <div className="space-y-0.5 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => { setActive(link.label); setOpen(false); }}
                  className={cn(
                    "block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    active === link.label
                      ? "text-primary bg-primary/5"
                      : "text-text-secondary hover:text-navy hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="px-2 pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link href="/auth/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-gray-50 transition-all">
                <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xs font-bold">M</span>
                </div>
                <span className="text-sm font-semibold text-navy">Espace médecin</span>
              </Link>
              <Link href="/auth/assureur"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-gray-50 transition-all">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-xs font-bold">A</span>
                </div>
                <span className="text-sm font-semibold text-navy">Espace assureur</span>
              </Link>
              <Link href="/auth/register"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-light transition-colors">
                Demander un accès
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
