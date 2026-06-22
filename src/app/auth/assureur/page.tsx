"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, Eye, EyeOff, Lock, UserCog, CheckCircle2, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/queries";
import { ApiException } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

type Tab = "login" | "register";

interface LoginForm   { email: string; password: string; }
interface RegisterForm { nom: string; prenom: string; email: string; password: string; confirm: string; }

// ─── Classe commune pour tous les inputs ─────────────────────────────────────
const inputBase =
  "w-full px-4 py-3 rounded-xl text-sm transition-all duration-150 focus:outline-none focus:ring-2";

// Sur fond sombre (navy) → fond blanc semi-transparent bien visible
const inputDark =
  `${inputBase} bg-white/15 border border-white/30 text-white placeholder-white/40
   focus:ring-primary/50 focus:border-primary/60 focus:bg-white/20
   hover:border-white/45 hover:bg-white/18`;

const inputDarkError =
  `${inputBase} bg-white/15 border border-red-400/70 text-white placeholder-white/40
   focus:ring-red-400/40 focus:border-red-400`;

export default function AssureurPage() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  const [tab,       setTab]       = useState<Tab>("login");
  const [success,   setSuccess]   = useState(false);
  const [showPwd,   setShowPwd]   = useState(false);
  const [showCfm,   setShowCfm]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const [login, setLogin] = useState<LoginForm>({ email: "", password: "" });

  const [reg, setReg] = useState<RegisterForm>({
    nom: "", prenom: "", email: "", password: "", confirm: "",
  });
  const [regErr, setRegErr] = useState<Partial<RegisterForm & { global: string }>>({});

  const setR = (k: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setReg(prev => ({ ...prev, [k]: e.target.value }));
    setRegErr(prev => ({ ...prev, [k]: undefined, global: undefined }));
  };

  const validateReg = () => {
    const e: typeof regErr = {};
    if (!reg.nom.trim())    e.nom    = "Champ obligatoire";
    if (!reg.prenom.trim()) e.prenom = "Champ obligatoire";
    if (!reg.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email)) e.email = "Email valide requis";
    if (reg.password.length < 8) e.password = "8 caractères minimum";
    if (reg.password !== reg.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    setRegErr(e);
    return Object.keys(e).length === 0;
  };

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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateReg()) return;
    setLoading(true); setRegErr({});
    try {
      await authApi.register({ nom: reg.nom.trim(), prenom: reg.prenom.trim(), email: reg.email.trim(), password: reg.password });
      const res = await signIn("assureur", { email: reg.email.trim(), password: reg.password, redirect: false });
      if (res?.ok) { setSuccess(true); setTimeout(() => router.push("/dashboard"), 1500); }
      else router.push("/auth/assureur?registered=true");
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.status === 409) {
          const msg = "Un compte assureur existe déjà dans le système.";
          setRegErr({ email: msg });
          toastError(msg);
        } else {
          setRegErr({ global: err.detail });
          toastError(err.detail);
        }
      } else {
        const msg = "Impossible de contacter le serveur. Vérifiez que le backend est démarré.";
        setRegErr({ global: msg });
        toastError(msg);
      }
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="text-center">
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

          {/* Onglets */}
          <div className="flex border-b border-white/10">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setRegErr({}); }}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  tab === t
                    ? "text-primary-light border-b-2 border-primary-light bg-white/5"
                    : "text-white/40 hover:text-white/65 hover:bg-white/3"
                }`}
              >
                {t === "login" ? "Se connecter" : "Créer le compte"}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ══ LOGIN ══ */}
            {tab === "login" && (
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

                <p className="text-center text-xs text-white/30 pt-1">
                  Pas encore de compte ?{" "}
                  <button type="button" onClick={() => setTab("register")}
                    className="text-primary-light hover:text-primary transition-colors font-semibold cursor-pointer">
                    Créer le compte assureur
                  </button>
                </p>
              </form>
            )}

            {/* ══ REGISTER ══ */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">

                {/* Notice */}
                <div className="flex items-start gap-2.5 px-3.5 py-3 bg-amber-400/12 border border-amber-400/25 rounded-xl text-xs text-amber-200/90">
                  <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Un seul compte assureur est autorisé. Si un compte existe déjà, l&apos;inscription sera refusée.
                </div>

                {/* Erreur globale */}
                {regErr.global && (
                  <div className="px-4 py-3 bg-red-500/15 border border-red-400/40 rounded-xl text-sm text-red-200">
                    {regErr.global}
                  </div>
                )}

                {/* Nom / Prénom */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">
                      Nom <span className="text-red-400">*</span>
                    </label>
                    <input type="text" value={reg.nom} onChange={setR("nom")}
                      placeholder="Dupont" autoComplete="family-name"
                      className={regErr.nom ? inputDarkError : inputDark} />
                    {regErr.nom && <p className="text-xs text-red-400 mt-1.5">{regErr.nom}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">
                      Prénom <span className="text-red-400">*</span>
                    </label>
                    <input type="text" value={reg.prenom} onChange={setR("prenom")}
                      placeholder="Jean" autoComplete="given-name"
                      className={regErr.prenom ? inputDarkError : inputDark} />
                    {regErr.prenom && <p className="text-xs text-red-400 mt-1.5">{regErr.prenom}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input type="email" value={reg.email} onChange={setR("email")}
                    placeholder="assureur@organisme.cm" autoComplete="email"
                    className={regErr.email ? inputDarkError : inputDark} />
                  {regErr.email && <p className="text-xs text-red-400 mt-1.5">{regErr.email}</p>}
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">
                    Mot de passe <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input type={showPwd ? "text" : "password"} value={reg.password} onChange={setR("password")}
                      placeholder="8 caractères minimum" autoComplete="new-password"
                      className={`${regErr.password ? inputDarkError : inputDark} pr-11`} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regErr.password && <p className="text-xs text-red-400 mt-1.5">{regErr.password}</p>}
                  {/* Indicateur force */}
                  {reg.password.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {[2, 4, 6, 8].map((threshold) => (
                        <div key={threshold} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          reg.password.length >= threshold
                            ? reg.password.length >= 8 ? "bg-primary-light" : "bg-amber-400"
                            : "bg-white/15"
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirmation */}
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">
                    Confirmer le mot de passe <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input type={showCfm ? "text" : "password"} value={reg.confirm} onChange={setR("confirm")}
                      placeholder="••••••••" autoComplete="new-password"
                      className={`${regErr.confirm ? inputDarkError : inputDark} pr-11`} />
                    <button type="button" onClick={() => setShowCfm(!showCfm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                      {showCfm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regErr.confirm && <p className="text-xs text-red-400 mt-1.5">{regErr.confirm}</p>}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-light transition-colors text-sm disabled:opacity-60 cursor-pointer mt-1">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Création…</>
                    : <><CheckCircle2 className="w-4 h-4" />Créer le compte assureur</>}
                </button>

                <p className="text-center text-xs text-white/30 pt-1">
                  Déjà un compte ?{" "}
                  <button type="button" onClick={() => setTab("login")}
                    className="text-primary-light hover:text-primary transition-colors font-semibold">
                    Se connecter
                  </button>
                </p>
              </form>
            )}
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
