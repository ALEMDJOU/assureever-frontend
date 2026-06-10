"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Shield, ArrowLeft, Eye, EyeOff, UserCog, Lock } from "lucide-react";

export default function LoginAssureurPage() {
  const router = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("assureur", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Identifiants incorrects ou accès non autorisé.");
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-white/50 hover:text-white/80 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-white text-2xl tracking-tight">
              Assure<span className="text-primary-light">ever</span>
            </span>
          </div>
          <p className="text-white/40 text-sm">Votre santé, notre engagement</p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">

          {/* Badge rôle */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <UserCog className="w-4 h-4 text-primary-light" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Espace assureur</h1>
              <p className="text-white/40 text-xs mt-0.5">Accès restreint — agent autorisé uniquement</p>
            </div>
          </div>

          {/* Notice sécurité */}
          <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 mb-6">
            <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Cet espace est réservé à l&apos;agent assureur de l&apos;organisme. Toute tentative non autorisée est enregistrée.
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Adresse email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="assureur@organisme.cm"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/30
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/30
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Connexion…
                </>
              ) : "Accéder au tableau de bord"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-white/30">
              Vous êtes médecin ?{" "}
              <Link href="/auth/login" className="text-primary-light hover:text-primary transition-colors font-medium">
                Espace médecin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
