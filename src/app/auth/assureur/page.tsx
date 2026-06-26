"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, ArrowLeft, Eye, EyeOff, Lock, UserCog } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface LoginForm { email: string; password: string; }

// ─── Classe commune pour tous les inputs ─────────────────────────────────────
const inputBase =
  "w-full px-4 py-3 rounded-xl text-sm transition-all duration-150 focus:outline-none focus:ring-2";

// Sur fond sombre (navy) → fond blanc semi-transparent bien visible
const inputDark =
  `${inputBase} bg-white/15 border border-white/30 text-white placeholder-white/40
   focus:ring-primary/50 focus:border-primary/60 focus:bg-white/20
   hover:border-white/45 hover:bg-white/18`;

export default function AssureurPage() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const [login, setLogin] = useState<LoginForm>({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await signIn("assureur", { email: login.email, password: login.password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      toastSuccess("Connexion réussie. Redirection…");
      router.push("/dashboard");
    } else {
      const msg = "Email ou mot de passe incorrect.";
      setError(msg);
      toastError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-7 text-white/40 hover:text-white/70 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>

          {/* Logo en couleur naturelle */}
          <Link href="/" className="flex items-center justify-center gap-3 group w-fit mx-auto mb-1">
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src="/images/logo.png"
                alt="AssureEver"
                fill
                sizes="48px"
                className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="font-extrabold text-white text-[22px] tracking-tight">
                Assure<span className="text-primary-light">ever</span>
              </span>
              <span className="text-[9px] text-white/35 font-medium tracking-widest uppercase mt-0.5">
                Votre santé, notre engagement
              </span>
            </div>
          </Link>
        </div>

        {/* ── Card ── */}
        <div className="bg-white/5 border border-white/12 backdrop-blur-sm rounded-2xl overflow-hidden">

          {/* Badge sécurité */}
          <div className="flex items-center gap-2.5 px-6 py-3.5 bg-primary/20 border-b border-white/10">
            <UserCog className="w-4 h-4 text-primary-light shrink-0" />
            <span className="text-sm font-semibold text-white">Espace assureur</span>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-amber-300/80 font-medium">
              <Lock className="w-3 h-3" />
              Accès restreint
            </span>
          </div>

          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="px-4 py-3 bg-red-500/15 border border-red-400/40 rounded-xl text-sm text-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Email</label>
                <input
                  type="email" required autoComplete="email"
                  value={login.email}
                  onChange={(e) => setLogin({ ...login, email: e.target.value })}
                  placeholder="assureur@organisme.cm"
                  className={inputDark}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"} required autoComplete="current-password"
                    value={login.password}
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                    placeholder="••••••••"
                    className={`${inputDark} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-light transition-colors text-sm disabled:opacity-60 cursor-pointer mt-1">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Connexion…</>
                  : <>Accéder au tableau de bord <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-white/25 mt-6">
          Vous êtes médecin ?{" "}
          <Link href="/auth/login" className="text-white/45 hover:text-white/70 transition-colors">
            Espace médecin →
          </Link>
        </p>
      </div>
    </div>
  );
}
