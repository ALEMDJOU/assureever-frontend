"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Shield, ArrowLeft, Eye, EyeOff, CheckCircle2, Stethoscope } from "lucide-react";

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
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Email ou mot de passe incorrect, ou vous n'êtes pas enregistré comme médecin.");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-text-muted hover:text-primary transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-navy text-2xl tracking-tight">
              Assure<span className="text-primary">ever</span>
            </span>
          </div>
          <p className="text-text-muted text-sm">Votre santé, notre engagement</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">

          {/* Badge rôle */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy leading-tight">Espace médecin</h1>
              <p className="text-text-muted text-xs mt-0.5">Connectez-vous avec vos identifiants fournis par l&apos;assureur</p>
            </div>
          </div>

          {info && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              {info}
            </div>
          )}

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Adresse email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="votre@email.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-sm py-3 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Connexion…
                </span>
              ) : "Se connecter"}
            </button>
          </form>

          {/* Lien discret vers l'espace assureur */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-text-muted">
              Vous êtes agent assureur ?{" "}
              <Link href="/auth/assureur" className="text-primary hover:text-primary-light transition-colors font-medium">
                Accéder à votre espace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
