"use client";

import { useState } from "react";
import { FileHeart, Plus, Search, CheckCircle2, Clock, Banknote } from "lucide-react";
import { useAssures, useFeuillesAssure, useCreerFeuille, useCompleterFeuille } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { InputField, SelectField } from "@/components/ui/FormField";
import PageHeader from "@/components/dashboard/PageHeader";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { FeuilleMaladieCreate, StatutFeuille } from "@/types/api";

const STATUT_CONFIG: Record<StatutFeuille, { label: string; icon: typeof Clock; color: string }> = {
  EN_ATTENTE: { label: "En attente",  icon: Clock,        color: "bg-amber-50 text-amber-700 border-amber-200" },
  COMPLETE:   { label: "Complétée",   icon: CheckCircle2, color: "bg-blue-50 text-blue-700 border-blue-200"   },
  REMBOURSEE: { label: "Remboursée",  icon: Banknote,     color: "bg-green-50 text-green-700 border-green-200" },
};

export default function FeuilleMaladiePage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;

  const [assureId,   setAssureId]   = useState("");
  const [modalOpen,  setModalOpen]  = useState(false);
  const [completerId,setCompleterId] = useState<string | null>(null);
  const [form,       setForm]       = useState<Partial<FeuilleMaladieCreate>>({});
  const [observations, setObs]      = useState("");

  const { data: assures } = useAssures(1, 100);
  const { data: feuilles, isLoading } = useFeuillesAssure(assureId);
  const creer    = useCreerFeuille();
  const completer = useCompleterFeuille();
  const { success, error } = useToast();

  const handleCreer = () => {
    if (!assureId || !form.consultation_id || !form.montant_consultation) return;
    creer.mutate(
      { assure_id: assureId, consultation_id: form.consultation_id!, montant_consultation: form.montant_consultation!, observations: form.observations },
      {
        onSuccess: () => { success("Feuille de maladie enregistrée"); setModalOpen(false); setForm({}); },
        onError: (err: any) => error(err.detail ?? "Erreur"),
      }
    );
  };

  const handleCompleter = () => {
    if (!completerId) return;
    completer.mutate({ id: completerId, data: { observations } }, {
      onSuccess: () => { success("Feuille complétée avec succès"); setCompleterId(null); setObs(""); },
      onError: (err: any) => error(err.detail ?? "Erreur"),
    });
  };

  return (
    <>
      <PageHeader
        icon={FileHeart}
        title="Feuilles de maladie"
        description={role === "MEDECIN" ? "Enregistrez les feuilles de maladie de vos patients" : "Consultez et complétez les feuilles de maladie"}
        action={role === "MEDECIN" ? (
          <button onClick={() => setModalOpen(true)} disabled={!assureId} className="btn-primary text-sm disabled:opacity-50">
            <Plus className="w-4 h-4" />
            Nouvelle feuille
          </button>
        ) : undefined}
      />

      {/* Sélecteur */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-navy mb-1.5">Assuré concerné</label>
          <select
            value={assureId}
            onChange={(e) => setAssureId(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary bg-white"
          >
            <option value="">-- Sélectionner un assuré --</option>
            {assures?.items.map((a) => (
              <option key={a.id} value={a.id}>{a.prenom} {a.nom} ({a.numero_assure})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des feuilles */}
      <div className="space-y-3">
        {!assureId ? (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-20 text-text-muted">
            <FileHeart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Sélectionnez un assuré</p>
          </div>
        ) : isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !feuilles?.length ? (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-20 text-text-muted">
            <p className="font-medium">Aucune feuille de maladie</p>
          </div>
        ) : (
          feuilles.map((f) => {
            const cfg = STATUT_CONFIG[f.statut];
            return (
              <div key={f.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-card transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileHeart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">
                      Feuille du {new Date(f.created_at).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Montant : <strong className="text-navy">{f.montant_consultation.toLocaleString("fr-FR")} FCFA</strong>
                      {f.observations && ` — ${f.observations}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border", cfg.color)}>
                    <cfg.icon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                  {role === "ASSUREUR" && f.statut === "EN_ATTENTE" && (
                    <button
                      onClick={() => setCompleterId(f.id)}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                    >
                      Compléter
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal créer feuille (médecin) */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Enregistrer une feuille de maladie">
        <div className="space-y-4">
          <InputField label="ID Consultation" required value={form.consultation_id ?? ""} onChange={(e) => setForm({ ...form, consultation_id: e.target.value })} placeholder="UUID de la consultation" />
          <InputField label="Montant de la consultation (FCFA)" type="number" required value={form.montant_consultation ?? ""} onChange={(e) => setForm({ ...form, montant_consultation: parseFloat(e.target.value) })} placeholder="Ex: 15000" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy">Observations</label>
            <textarea value={form.observations ?? ""} onChange={(e) => setForm({ ...form, observations: e.target.value })}
              rows={3} placeholder="Notes médicales, diagnostic…"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setModalOpen(false)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button onClick={handleCreer} disabled={creer.isPending} className="btn-primary text-sm px-5 py-2.5">
            {creer.isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </Modal>

      {/* Modal compléter feuille (assureur) */}
      <Modal open={!!completerId} onClose={() => setCompleterId(null)} title="Compléter la feuille de maladie" size="sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-navy">Observations complémentaires</label>
          <textarea value={observations} onChange={(e) => setObs(e.target.value)}
            rows={3} placeholder="Mentions de l'assureur…"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setCompleterId(null)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button onClick={handleCompleter} disabled={completer.isPending} className="btn-primary text-sm px-5 py-2.5">
            {completer.isPending ? "Enregistrement…" : "Valider"}
          </button>
        </div>
      </Modal>
    </>
  );
}
