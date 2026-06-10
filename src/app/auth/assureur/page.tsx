"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import {
  ArrowLeft, Eye, EyeOff, Lock,
  UserCog, CheckCircle2, ArrowRight,
} from "lucide-react";
import { authApi } from "@/lib/queries";
import { ApiException } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "login" | "register";

interface LoginForm  { email: string; password: string; }
interface RegisterForm {
  nom: string; prenom: string;
  email: string; password: string; confirm: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

export default function AssureurPage() {
  const router = useRouter();

  const [tab,      setTab]      = useState<Tab>("login");
  const [success,  setSuccess]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // Login form
  const [login, setLogin] = useState<LoginForm>({ email: "", password: "" });

  // Register form
  const [reg,      setReg]      = useState<RegisterForm>({
    nom: "", prenom: "", email: "", password: "", confirm: "",
  });
  const [regErrors, setRegErrors] = useState<Partial<RegisterForm & { global: string }>>({});

  // ── Validation register ──
  const validateReg = (): boolean => {
    const e: typeof regErrors = {};
    if (!reg.nom.trim())    e.nom    = "Champ obligatoire";
    if (!reg.prenom.trim()) e.prenom = "Champ obligatoire";
    if (!reg.email.trim())  e.email  = "Champ obligatoire";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email)) e.email = "Email invalide";
    if (reg.password.length < 8) e.password = "8 caractères minimum";
    if (reg.password !== reg.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    setRegErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit login ──
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await signIn("assureur", { email: login.email, password: login.password, redirect: false });
    setLoading(false);
    if (res?.ok) router.push("/dashboard");
    else setError("Identifiants incorrects ou accès non autorisé.");
  };

  // ── Submit register ──
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateReg()) return;
    setLoading(true); setRegErrors({});
    try {
      await authApi.register({
        nom: reg.nom.trim(), prenom: reg.prenom.trim(),
        email: reg.email.trim(), password: reg.password,
      });
      // Connexion automatique après inscription
      const res = await signIn("assureur", {
        email: reg.email.trim(), password: reg.password, redirect: false,
      });
      if (res?.ok) { setSuccess(true); setTimeout(() => router.push("/dashboard"), 1600); }
      else router.push("/auth/assureur?registered=true");
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.status === 409)
          setRegErrors({ email: "Un compte assureur existe déjà dans le système." });
        else
          setRegErrors({ global: err.detail });
      } else {
        setRegErrors({ global: "Impossible de contacter le serveur. Vérifiez que le backend est démarré." });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Écran succès ──
  if (success) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary-light" />
          </div>
          <h2 className="font-bold text-white text-xl mb-2">Compte créé avec succès !</h2>
          <p className="text-white/50 text-sm">Redirection vers le tableau de bord…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-white/40 hover:text-white/70 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="relative w-11 h-11">
              <Image src="/images/logo.png" alt="AssureEver" fill className="object-contain brightness-0 invert" priority />
            </div>
            <span className="font-extrabold text-white text-2xl tracking-tight">
              Assure<span className="text-primary-light">ever</span>
            </span>
          </div>
          <p className="text-white/35 text-xs tracking-widest uppercase">Votre santé, notre engagement</p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">

          {/* Badge sécurité */}
          <div className="flex items-center gap-2.5 px-6 py-3.5 bg-primary/15 border-b border-white/10">
            <UserCog className="w-4 h-4 text-primary-light shrink-0" />
            <span className="text-sm font-semibold text-white/90">Espace assureur</span>
            <span className="ml-auto flex items-center gap-1 text-xs text-amber-300/80">
              <Lock className="w-3 h-3" />
              Accès restreint
            </span>
          </div>

          {/* ── Onglets ── */}
          <div className="flex border-b border-white/10">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setRegErrors({}); }}
                className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? "text-primary-light border-b-2 border-primary-light bg-primary/10"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {t === "login" ? "Se connecter" : "Créer le compte"}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ══ FORMULAIRE LOGIN ══ */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
                  <input
                    type="email" required
                    value={login.email}
                    onChange={(e) => setLogin({ ...login, email: e.target.value })}
                    placeholder="assureur@organisme.cm"
                    className="w-full px-4 py-2.5 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"} required
                      value={login.password}
                      onChange={(e) => setLogin({ ...login, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-light transition-colors text-sm disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Connexion…</>
                  ) : (
                    <>Accéder au tableau de bord <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <p className="text-center text-xs text-white/30 pt-1">
                  Pas encore de compte ?{" "}
                  <button type="button" onClick={() => setTab("register")} className="text-primary-light hover:text-primary transition-colors font-medium">
                    Créer le compte assureur
                  </button>
                </p>
              </form>
            )}

            {/* ══ FORMULAIRE REGISTER ══ */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">

                {/* Notice unicité */}
                <div className="flex items-start gap-2.5 px-3.5 py-3 bg-amber-400/10 border border-amber-400/20 rounded-xl text-xs text-amber-300/90">
                  <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Ce système n&apos;autorise qu&apos;un seul compte assureur. Si un compte existe déjà, l&apos;inscription sera refusée.
                </div>

                {regErrors.global && (
                  <div className="px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-300">
                    {regErrors.global}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      Nom <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" value={reg.nom}
                      onChange={(e) => { setReg({ ...reg, nom: e.target.value }); setRegErrors({ ...regErrors, nom: undefined }); }}
                      placeholder="Dupont"
                      className={`w-full px-3 py-2.5 bg-white/8 border rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${regErrors.nom ? "border-red-500/50" : "border-white/15"}`}
                    />
                    {regErrors.nom && <p className="text-xs text-red-400 mt-1">{regErrors.nom}</p>}
                  </div>
                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      Prénom <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" value={reg.prenom}
                      onChange={(e) => { setReg({ ...reg, prenom: e.target.value }); setRegErrors({ ...regErrors, prenom: undefined }); }}
                      placeholder="Jean"
                      className={`w-full px-3 py-2.5 bg-white/8 border rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${regErrors.prenom ? "border-red-500/50" : "border-white/15"}`}
                    />
                    {regErrors.prenom && <p className="text-xs text-red-400 mt-1">{regErrors.prenom}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email" value={reg.email}
                    onChange={(e) => { setReg({ ...reg, email: e.target.value }); setRegErrors({ ...regErrors, email: undefined }); }}
                    placeholder="assureur@organisme.cm"
                    className={`w-full px-4 py-2.5 bg-white/8 border rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${regErrors.email ? "border-red-500/50" : "border-white/15"}`}
                  />
                  {regErrors.email && <p className="text-xs text-red-400 mt-1">{regErrors.email}</p>}
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Mot de passe <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"} value={reg.password}
                      onChange={(e) => { setReg({ ...reg, password: e.target.value }); setRegErrors({ ...regErrors, password: undefined }); }}
                      placeholder="8 caractères minimum"
                      className={`w-full px-4 py-2.5 pr-10 bg-white/8 border rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${regErrors.password ? "border-red-500/50" : "border-white/15"}`}
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regErrors.password && <p className="text-xs text-red-400 mt-1">{regErrors.password}</p>}
                  {/* Force du mot de passe */}
                  {reg.password.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          reg.password.length >= (i + 1) * 2
                            ? reg.password.length >= 8 ? "bg-primary-light" : "bg-amber-400"
                            : "bg-white/10"
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirmation */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Confirmer le mot de passe <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password" value={reg.confirm}
                    onChange={(e) => { setReg({ ...reg, confirm: e.target.value }); setRegErrors({ ...regErrors, confirm: undefined }); }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 bg-white/8 border rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${regErrors.confirm ? "border-red-500/50" : "border-white/15"}`}
                  />
                  {regErrors.confirm && <p className="text-xs text-red-400 mt-1">{regErrors.confirm}</p>}
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-light transition-colors text-sm disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Création…</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" />Créer le compte assureur</>
                  )}
                </button>

                <p className="text-center text-xs text-white/30 pt-1">
                  Déjà un compte ?{" "}
                  <button type="button" onClick={() => setTab("login")} className="text-primary-light hover:text-primary transition-colors font-medium">
                    Se connecter
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Lien espace médecin */}
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
