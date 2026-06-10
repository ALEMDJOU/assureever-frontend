"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Shield, UserPlus, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Accueil",        href: "#accueil" },
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Avantages",      href: "#avantages" },
  { label: "À propos",       href: "#apropos" },
  { label: "Contact",        href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen]           = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [active, setActive]       = useState("Accueil");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-navy text-lg tracking-tight">
                Assure<span className="text-primary">ever</span>
              </span>
              <span className="text-[10px] text-text-muted font-medium -mt-0.5 tracking-wide">
                Votre santé, notre engagement
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors duration-150 rounded-md",
                    active === link.label
                      ? "text-primary"
                      : "text-text-secondary hover:text-primary"
                  )}
                >
                  {link.label}
                  {active === link.label && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors px-3 py-2"
            >
              <LogIn className="w-4 h-4" />
              Espace médecin
            </Link>
            <Link
              href="/auth/assureur"
              className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors px-3 py-2"
            >
              <LogIn className="w-4 h-4" />
              Espace assureur
            </Link>
            <Link
              href="/auth/register"
              className="btn-primary text-sm py-2.5 px-5"
            >
              <UserPlus className="w-4 h-4" />
              Demander un accès
            </Link>
          </div>

          {/* Burger mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary hover:bg-surface transition-colors"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => { setActive(link.label); setOpen(false); }}
                className="block px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2 px-4">
              <Link href="/auth/login"    className="btn-outline text-sm justify-center">Espace médecin</Link>
              <Link href="/auth/assureur" className="btn-outline text-sm justify-center">Espace assureur</Link>
              <Link href="/auth/register" className="btn-primary text-sm justify-center">Demander un accès</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
