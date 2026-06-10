"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Stethoscope } from "lucide-react";

export default function LoginMedecinPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [info,     setInfo]     = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setInfo("Compte créé avec succès. Connectez-vous pour accéder au tableau de bord.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("medecin", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) router.push("/dashboard");
    else setError("Email ou mot de passe incorrect, ou vous n'êtes pas enregistré comme médecin.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* ── Logo + nom ── */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-7 text-text-muted hover:text-primary transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
          <Link href="/" className="flex items-center justify-center gap-3 group w-fit mx-auto">
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src="/images/logo.png"
                alt="AssureEver"
                fill
                className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="font-extrabold text-navy text-[22px] tracking-tight">
                Assure<span className="text-primary">ever</span>
              </span>
              <span className="text-[9px] text-text-muted font-medium tracking-widest uppercase mt-0.5">
                Votre santé, notre engagement
              </span>
            </div>
          </Link>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">

          {/* Badge rôle */}
          <div className="flex items-center gap-3 px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-navy leading-tight">Espace médecin</h1>
              <p className="text-blue-600/70 text-xs mt-0.5">Connectez-vous avec vos identifiants fournis par l&apos;assureur</p>
            </div>
          </div>

          <div className="p-7">
            {/* Succès */}
            {info && (
              <div className="mb-5 flex items-start gap-2.5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
                {info}
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Adresse email
                </label>
                <input
                  type="email" value={email} required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white
                             hover:border-gray-300 transition-all duration-150"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"} value={password} required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white
                               hover:border-gray-300 transition-all duration-150"
                  />
                  <button
                    type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 mt-1 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Connexion…
                  </span>
                ) : "Se connecter"}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-xs text-text-muted">
                Vous êtes agent assureur ?{" "}
                <Link href="/auth/assureur" className="text-primary font-semibold hover:text-primary-light transition-colors">
                  Accéder à votre espace
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
