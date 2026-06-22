"use client";

import { useState } from "react";
import { Banknote, Search, Download, Plus, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useAssures, useRemboursements, useEffectuerRemboursement, useTelechargerFacture, useFeuillesEnAttente } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { SelectField, InputField } from "@/components/ui/FormField";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import type { Remboursement, RemboursementCreate, ModePaiement } from "@/types/api";

const STATUT_CONFIG = {
  PAYE:      { label: "Payé",       icon: CheckCircle2, color: "text-green-600 bg-green-50" },
  EN_ATTENTE:{ label: "En attente", icon: Clock,        color: "text-amber-600 bg-amber-50" },
  ANNULE:    { label: "Annulé",     icon: XCircle,      color: "text-red-600 bg-red-50"     },
};

export default function RemboursementsPage() {
  const [assureId,   setAssureId]   = useState("");
  const [modalOpen,  setModalOpen]  = useState(false);
  const [feuilleId,  setFeuilleId]  = useState("");
  const [modePaiement, setModePaiement] = useState<ModePaiement>("VIREMENT_BANCAIRE");
  const [reference,  setReference]  = useState("");

  const { data: assures } = useAssures(1, 100);
  const { data: remboursements, isLoading } = useRemboursements(assureId);
  const { data: feuillesEnAttente } = useFeuillesEnAttente(assureId);
  const effectuer       = useEffectuerRemboursement();
  const telecharger     = useTelechargerFacture();
  const { success, error } = useToast();

  const handleEffectuer = () => {
    if (!assureId || !feuilleId) return;
    const data: RemboursementCreate = {
      assure_id: assureId,
      feuille_maladie_id: feuilleId,
      mode_paiement: modePaiement,
      reference_virement: modePaiement === "VIREMENT_BANCAIRE" ? reference : undefined,
    };
    effectuer.mutate(data, {
      onSuccess: (r) => {
        success(`Remboursement effectué — ${r.montant_rembourse.toLocaleString("fr-FR")} FCFA (${r.taux_remboursement}%)`);
        setModalOpen(false);
        setFeuilleId("");
        setReference("");
      },
      onError: (err: any) => error(err.detail ?? "Erreur lors du remboursement"),
    });
  };

  const handleDownload = (r: Remboursement) => {
    const date = new Date(r.date_remboursement).toISOString().split("T")[0];
    const filename = `facture-remboursement-${date}-${r.id.slice(0, 8)}.pdf`;
    telecharger.mutate({ id: r.id, filename }, {
      onError: (err: any) => error(err.detail ?? "Erreur lors du téléchargement"),
    });
  };

  return (
    <>
      <PageHeader
        icon={Banknote}
        title="Remboursements"
        description="Gérez les remboursements médicaux et téléchargez les factures PDF"
        action={
          <button
            onClick={() => setModalOpen(true)}
            disabled={!assureId || !feuillesEnAttente?.length}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Nouveau remboursement
          </button>
        }
      />

      {/* Sélecteur assuré */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[280px]">
            <label className="block text-sm font-medium text-navy mb-1.5">
              Sélectionner un assuré
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <select
                value={assureId}
                onChange={(e) => setAssureId(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary bg-white"
              >
                <option value="">-- Choisir un assuré --</option>
                {assures?.items.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.prenom} {a.nom} ({a.numero_assure})
                  </option>
                ))}
              </select>
            </div>
          </div>
          {assureId && feuillesEnAttente !== undefined && (
            <div className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium",
              feuillesEnAttente.length > 0
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-green-50 text-green-700 border border-green-200"
            )}>
              {feuillesEnAttente.length > 0
                ? `${feuillesEnAttente.length} feuille(s) en attente`
                : "Aucune feuille en attente"}
            </div>
          )}
        </div>
      </div>

      {/* Historique */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!assureId ? (
          <div className="text-center py-20 text-text-muted">
            <Banknote className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Sélectionnez un assuré pour voir ses remboursements</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !remboursements?.items.length ? (
          <div className="text-center py-20 text-text-muted">
            <p className="font-medium">Aucun remboursement pour cet assuré</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Date", "Taux", "Montant consultation", "Montant remboursé", "Mode paiement", "Statut", "Facture"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {remboursements.items.map((r) => {
                const cfg = STATUT_CONFIG[r.statut];
                return (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-text-secondary">
                      {new Date(r.date_remboursement).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        "inline-block px-2.5 py-1 rounded-full text-xs font-bold",
                        r.taux_remboursement === 100 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {r.taux_remboursement}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">
                      {r.montant_consultation.toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="px-4 py-3.5 font-bold text-navy">
                      {r.montant_rembourse.toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">
                      {r.mode_paiement === "VIREMENT_BANCAIRE" ? "Virement bancaire" : "Espèces"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", cfg.color)}>
                        <cfg.icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleDownload(r)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-text-secondary hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
        {remboursements && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-text-muted">
            {remboursements.total} remboursement{remboursements.total > 1 ? "s" : ""}
            {remboursements.total > 0 && (
              <span className="ml-4 font-semibold text-navy">
                Total remboursé : {remboursements.items.reduce((s, r) => s + r.montant_rembourse, 0).toLocaleString("fr-FR")} FCFA
              </span>
            )}
          </div>
        )}
      </div>

      {/* Modal remboursement */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Effectuer un remboursement" size="md">
        <div className="space-y-4">
          <SelectField
            label="Feuille de maladie à rembourser"
            required
            value={feuilleId}
            onChange={(e) => setFeuilleId(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {feuillesEnAttente?.map((f) => (
              <option key={f.id} value={f.id}>
                Feuille du {new Date(f.created_at).toLocaleDateString("fr-FR")} — {f.montant_consultation.toLocaleString()} FCFA
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Mode de paiement"
            required
            value={modePaiement}
            onChange={(e) => setModePaiement(e.target.value as ModePaiement)}
          >
            <option value="VIREMENT_BANCAIRE">Virement bancaire</option>
            <option value="ESPECES">Espèces</option>
          </SelectField>

          {modePaiement === "VIREMENT_BANCAIRE" && (
            <InputField
              label="Référence virement (optionnel)"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="IBAN ou référence bancaire"
            />
          )}

          <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 text-sm text-text-secondary">
            Le taux sera calculé automatiquement : <strong className="text-navy">100%</strong> pour un généraliste,
            <strong className="text-navy"> 80%</strong> pour un spécialiste.
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setModalOpen(false)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button onClick={handleEffectuer} disabled={!feuilleId || effectuer.isPending} className="btn-primary text-sm px-5 py-2.5">
            {effectuer.isPending ? "Traitement…" : "Confirmer le remboursement"}
          </button>
        </div>
      </Modal>
    </>
  );
}
