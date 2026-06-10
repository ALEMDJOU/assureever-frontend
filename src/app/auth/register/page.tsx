"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Shield, ArrowLeft, Eye, EyeOff, CheckCircle2, UserCog } from "lucide-react";
import { authApi } from "@/lib/queries";
import { ApiException } from "@/lib/api";

interface FormState {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirm: string;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  confirm?: string;
  global?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form,    setForm]    = useState<FormState>({ nom: "", prenom: "", email: "", password: "", confirm: "" });
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: undefined, global: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.nom.trim())    e.nom    = "Champ obligatoire";
    if (!form.prenom.trim()) e.prenom = "Champ obligatoire";
    if (!form.email.trim())  e.email  = "Champ obligatoire";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (form.password.length < 8) e.password = "8 caractères minimum";
    if (form.password !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      // 1. Créer le compte via l'API FastAPI
      await authApi.register({
        nom:      form.nom.trim(),
        prenom:   form.prenom.trim(),
        email:    form.email.trim(),
        password: form.password,
      });

      // 2. Connecter automatiquement avec NextAuth
      const res = await signIn("credentials", {
        email:    form.email.trim(),
        password: form.password,
        redirect: false,
      });

      if (res?.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        // Compte créé mais connexion auto échouée → rediriger vers login
        router.push("/auth/login?registered=true");
      }
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.status === 409) {
          setErrors({ email: "Un compte avec cet email existe déjà" });
        } else {
          setErrors({ global: err.detail });
        }
      } else {
        setErrors({ global: "Une erreur inattendue s'est produite. Réessayez." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-bold text-navy text-xl mb-2">Compte créé avec succès !</h2>
          <p className="text-text-muted text-sm">Redirection vers le tableau de bord…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fade-in-up">

        {/* Header */}
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserCog className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy leading-tight">Créer un compte assureur</h1>
              <p className="text-text-muted text-xs mt-0.5">Accès réservé aux agents de l&apos;organisme</p>
            </div>
          </div>

          {/* Info rôle */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-xs text-amber-800">
            <strong>Note :</strong> Cet espace est réservé aux agents assureurs.
            Les comptes médecins sont créés par les assureurs depuis le tableau de bord.
          </div>

          {/* Erreur globale */}
          {errors.global && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.nom} onChange={set("nom")}
                  placeholder="Dupont"
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors ${errors.nom ? "border-red-400 bg-red-50/30" : "border-gray-200"}`} />
                {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.prenom} onChange={set("prenom")}
                  placeholder="Jean"
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors ${errors.prenom ? "border-red-400 bg-red-50/30" : "border-gray-200"}`} />
                {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <input type="email" value={form.email} onChange={set("email")}
                placeholder="votre@organisme.cm"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors ${errors.email ? "border-red-400 bg-red-50/30" : "border-gray-200"}`} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="8 caractères minimum"
                  className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors ${errors.password ? "border-red-400 bg-red-50/30" : "border-gray-200"}`} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              {/* Indicateur de force */}
              {form.password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= (i + 1) * 2
                        ? form.password.length >= 8 ? "bg-green-400" : "bg-amber-400"
                        : "bg-gray-200"
                    }`} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Confirmer le mot de passe <span className="text-red-500">*</span>
              </label>
              <input type="password" value={form.confirm} onChange={set("confirm")}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors ${errors.confirm ? "border-red-400 bg-red-50/30" : "border-gray-200"}`} />
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-sm py-3 mt-2 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Création du compte…
                </span>
              ) : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:text-primary-light transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
