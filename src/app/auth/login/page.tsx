import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
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

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-navy mb-1">Connexion</h1>
          <p className="text-text-muted text-sm mb-7">Accédez à votre espace de gestion</p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              <div className="text-right mt-2">
                <a href="#" className="text-xs text-primary hover:text-primary-light transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center text-sm py-3"
            >
              Se connecter
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Pas encore de compte ?{" "}
            <Link href="/auth/register" className="text-primary font-medium hover:text-primary-light transition-colors">
              Demander un accès
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
