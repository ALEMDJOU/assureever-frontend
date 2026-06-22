"use client";

import { useState } from "react";
import {
  Users, Plus, Search, UserCheck,
  Calendar, Phone, Mail, MapPin, CreditCard,
} from "lucide-react";
import { useAssures, useCreerAssure, useGeneralistes, useAssocierMedecinTraitant } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import type { AssureCreate } from "@/types/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type PreferencePaiement = "VIREMENT_BANCAIRE" | "ESPECES" | "MOBILE_MONEY";

interface FormState extends AssureCreate {
  preference_paiement: PreferencePaiement;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  date_naissance?: string;
  telephone?: string;
  email?: string;
}

const EMPTY: FormState = {
  nom: "", prenom: "", date_naissance: "", adresse: "",
  telephone: "", email: "", preference_paiement: "VIREMENT_BANCAIRE",
};

// ─── Classes inputs ───────────────────────────────────────────────────────────

const inputCls = (err?: string) =>
  cn(
    "w-full px-4 py-2.5 rounded-xl border text-sm text-navy placeholder-gray-400 bg-white",
    "focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all",
    err ? "border-red-400 bg-red-50/30" : "border-gray-200 hover:border-gray-300"
  );

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssuresPage() {
  const [page,          setPage]         = useState(1);
  const [recherche,     setRecherche]    = useState("");
  const [modalOpen,     setModalOpen]    = useState(false);
  const [medecinModal,  setMedecinModal] = useState<string | null>(null);
  const [form,          setForm]         = useState<FormState>(EMPTY);
  const [errors,        setErrors]       = useState<FormErrors>({});
  const [medecinChoisi, setMedecinChoisi] = useState("");

  const { data, isLoading }    = useAssures(page, 20, recherche);
  const { data: generalistes } = useGeneralistes();
  const creer           = useCreerAssure();
  const associerMedecin = useAssocierMedecinTraitant();
  const { success, error } = useToast();

  // ── Helper ──
  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [k]: e.target.value }));
      setErrors(prev => ({ ...prev, [k]: undefined }));
    };

  // ── Validation ──
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.nom.trim())         e.nom            = "Champ obligatoire";
    if (!form.prenom.trim())      e.prenom         = "Champ obligatoire";
    if (!form.date_naissance)     e.date_naissance = "Champ obligatoire";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    creer.mutate(form, {
      onSuccess: () => {
        success("Assuré inscrit avec succès");
        setModalOpen(false);
        setForm(EMPTY);
        setErrors({});
      },
      onError: (err: any) =>
        error(err.detail ?? "Erreur lors de l'inscription"),
    });
  };

  const handleAssocierMedecin = () => {
    if (!medecinModal || !medecinChoisi) return;
    associerMedecin.mutate({ assureId: medecinModal, medecinId: medecinChoisi }, {
      onSuccess: () => {
        success("Médecin traitant associé");
        setMedecinModal(null);
        setMedecinChoisi("");
      },
      onError: (err: any) => error(err.detail ?? "Erreur"),
    });
  };

  const resetModal = () => { setModalOpen(false); setForm(EMPTY); setErrors({}); };

  return (
    <>
      <PageHeader
        icon={Users}
        title="Gestion des assurés"
        description="Inscrivez et gérez les dossiers des assurés"
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            Nouvel assuré
          </button>
        }
      />

      {/* ── Barre de recherche ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou numéro…"
            value={recherche}
            onChange={(e) => { setRecherche(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary bg-white"
          />
        </div>
      </div>

      {/* ── Tableau ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data?.items.length ? (
          <div className="text-center py-20 text-text-muted">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucun assuré trouvé</p>
            <p className="text-sm mt-1">Cliquez sur « Nouvel assuré » pour commencer.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Assuré", "N° Assuré", "Naissance", "Téléphone", "Médecin traitant", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.items.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                        {a.prenom.charAt(0)}{a.nom.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-navy">{a.prenom} {a.nom}</p>
                        <p className="text-xs text-text-muted">{a.email ?? "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary">{a.numero_assure}</td>
                  <td className="px-4 py-3.5 text-text-secondary text-xs">
                    {new Date(a.date_naissance).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary text-xs">{a.telephone ?? "—"}</td>
                  <td className="px-4 py-3.5">
                    {a.medecin_traitant_id ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                        <UserCheck className="w-3 h-3" /> Assigné
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted italic">Non assigné</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setMedecinModal(a.id)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                      title="Assigner médecin traitant"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}

        {data && data.total > 20 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-text-muted text-xs">{data.total} assurés</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs disabled:opacity-40 hover:bg-gray-50 transition-colors">
                Précédent
              </button>
              <span className="px-3 py-1.5 text-xs text-text-muted">Page {page}</span>
              <button disabled={page * 20 >= data.total} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs disabled:opacity-40 hover:bg-gray-50 transition-colors">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══ MODAL INSCRIPTION ══ */}
      <Modal open={modalOpen} onClose={resetModal} title="Inscrire un nouvel assuré" size="lg">
        <div className="space-y-5">

          {/* Ligne 1 — Identité */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
              Identité
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" value={form.nom} onChange={set("nom")}
                  placeholder="Dupont" autoComplete="family-name"
                  className={inputCls(errors.nom)}
                />
                {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" value={form.prenom} onChange={set("prenom")}
                  placeholder="Jean" autoComplete="given-name"
                  className={inputCls(errors.prenom)}
                />
                {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
              </div>
            </div>
          </div>

          {/* Ligne 2 — Date de naissance */}
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-text-muted" />
              Date de naissance <span className="text-red-500">*</span>
            </label>
            <input
              type="date" value={form.date_naissance} onChange={set("date_naissance")}
              max={new Date().toISOString().split("T")[0]}
              className={inputCls(errors.date_naissance)}
            />
            {errors.date_naissance && <p className="text-xs text-red-500 mt-1">{errors.date_naissance}</p>}
          </div>

          {/* Ligne 3 — Contact */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
              Contact <span className="font-normal normal-case text-text-muted">(optionnel)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">
                  <Phone className="w-3.5 h-3.5 inline mr-1.5 text-text-muted" />
                  Téléphone
                </label>
                <input
                  type="tel" value={form.telephone ?? ""} onChange={set("telephone")}
                  placeholder="+237 6XX XXX XXX" autoComplete="tel"
                  className={inputCls(errors.telephone)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">
                  <Mail className="w-3.5 h-3.5 inline mr-1.5 text-text-muted" />
                  Email
                </label>
                <input
                  type="email" value={form.email ?? ""} onChange={set("email")}
                  placeholder="jean@email.cm" autoComplete="email"
                  className={inputCls(errors.email)}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Ligne 4 — Adresse */}
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              <MapPin className="w-3.5 h-3.5 inline mr-1.5 text-text-muted" />
              Adresse
            </label>
            <input
              type="text" value={form.adresse ?? ""} onChange={set("adresse")}
              placeholder="Yaoundé, Centre" autoComplete="street-address"
              className={inputCls()}
            />
          </div>

          {/* Ligne 5 — Préférence de paiement */}
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              <CreditCard className="w-3.5 h-3.5 inline mr-1.5 text-text-muted" />
              Mode de remboursement préféré
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(["VIREMENT_BANCAIRE", "ESPECES", "MOBILE_MONEY"] as const).map((val) => {
                const labels: Record<string, string> = {
                  VIREMENT_BANCAIRE: "Virement bancaire",
                  ESPECES:           "Espèces",
                  MOBILE_MONEY:      "Mobile Money",
                };
                return (
                  <label key={val}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium",
                      form.preference_paiement === val
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-text-secondary hover:border-primary/30 hover:bg-gray-50"
                    )}>
                    <input
                      type="radio" name="preference_paiement" value={val}
                      checked={form.preference_paiement === val}
                      onChange={() => setForm(prev => ({ ...prev, preference_paiement: val }))}
                      className="accent-primary"
                    />
                    {labels[val]}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">
          <button onClick={resetModal} className="btn-outline text-sm px-5 py-2.5">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={creer.isPending} className="btn-primary text-sm px-5 py-2.5">
            {creer.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Inscription…
              </span>
            ) : "Inscrire l'assuré"}
          </button>
        </div>
      </Modal>

      {/* ══ MODAL MÉDECIN TRAITANT ══ */}
      <Modal open={!!medecinModal} onClose={() => setMedecinModal(null)} title="Assigner un médecin traitant" size="sm">
        <p className="text-sm text-text-secondary mb-4">
          Sélectionnez un médecin généraliste à désigner comme médecin traitant de cet assuré.
        </p>
        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">Médecin généraliste</label>
          <select
            value={medecinChoisi}
            onChange={(e) => setMedecinChoisi(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
          >
            <option value="">-- Choisir un médecin --</option>
            {generalistes?.items.map((m) => (
              <option key={m.id} value={m.id}>Dr. {m.prenom} {m.nom}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setMedecinModal(null)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button
            onClick={handleAssocierMedecin}
            disabled={!medecinChoisi || associerMedecin.isPending}
            className="btn-primary text-sm px-5 py-2.5"
          >
            {associerMedecin.isPending ? "Enregistrement…" : "Confirmer"}
          </button>
        </div>
      </Modal>
    </>
  );
}
