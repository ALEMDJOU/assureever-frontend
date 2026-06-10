import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

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
          <h1 className="text-xl font-bold text-navy mb-1">Demander un accès</h1>
          <p className="text-text-muted text-sm mb-7">Créez votre compte pour accéder à la plateforme</p>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Nom</label>
                <input type="text" placeholder="Dupont"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Prénom</label>
                <input type="text" placeholder="Jean"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Rôle</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-white">
                <option value="">Sélectionner un rôle</option>
                <option value="ASSUREUR">Agent assureur</option>
                <option value="MEDECIN">Médecin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Email</label>
              <input type="email" placeholder="votre@email.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Mot de passe</label>
              <input type="password" placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Confirmer le mot de passe</label>
              <input type="password" placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <button type="submit" className="btn-primary w-full justify-center text-sm py-3">
              Créer mon compte
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
