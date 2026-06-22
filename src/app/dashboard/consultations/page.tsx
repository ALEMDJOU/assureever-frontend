"use client";

import { useState } from "react";
import { Stethoscope, Plus, Calendar, FileText, Banknote } from "lucide-react";
import { useAssures, useMesConsultations, useCreerConsultation } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import type { ConsultationCreate } from "@/types/api";

const EMPTY: ConsultationCreate = {
  assure_id: "",
  date_consultation: new Date().toISOString().split("T")[0],
  motif: "",
  diagnostic: "",
  actes_realises: "",
  montant_consultation: 0,
};

const inputCls = (err?: boolean) =>
  cn(
    "w-full px-4 py-2.5 rounded-xl border text-sm text-navy placeholder-gray-400 bg-white",
    "focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all",
    err ? "border-red-400 bg-red-50/30" : "border-gray-200 hover:border-gray-300"
  );

interface FormErrors {
  assure_id?: string;
  date_consultation?: string;
  motif?: string;
  montant_consultation?: string;
}

export default function ConsultationsPage() {
  const [assureFilter, setAssureFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ConsultationCreate>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: assures } = useAssures(1, 100);
  const { data, isLoading } = useMesConsultations(assureFilter || undefined);
  const creer = useCreerConsultation();
  const { success, error } = useToast();

  const set = (k: keyof ConsultationCreate) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [k]: e.target.value }));
      setErrors(prev => ({ ...prev, [k]: undefined }));
    };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.assure_id)               e.assure_id            = "Champ obligatoire";
    if (!form.date_consultation)       e.date_consultation    = "Champ obligatoire";
    if (!form.motif.trim())            e.motif                = "Champ obligatoire";
    if (!form.montant_consultation || form.montant_consultation <= 0)
                                        e.montant_consultation = "Montant requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    creer.mutate(
      {
        ...form,
        montant_consultation: Number(form.montant_consultation),
        diagnostic: form.diagnostic || undefined,
        actes_realises: form.actes_realises || undefined,
      },
      {
        onSuccess: () => {
          success("Consultation enregistrée avec succès");
          setModalOpen(false);
          setForm(EMPTY);
          setErrors({});
        },
        onError: (err: any) => error(err.detail ?? "Erreur lors de l'enregistrement"),
      }
    );
  };

  const resetModal = () => { setModalOpen(false); setForm(EMPTY); setErrors({}); };

  return (
    <>
      <PageHeader
        icon={Stethoscope}
        title="Mes consultations"
        description="Enregistrez vos consultations et créez les feuilles de maladie associées"
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            Nouvelle consultation
          </button>
        }
      />

      {/* Filtre par assuré */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
        <div className="max-w-sm">
          <label className="block text-sm font-medium text-navy mb-1.5">Filtrer par assuré</label>
          <select
            value={assureFilter}
            onChange={(e) => setAssureFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary bg-white"
          >
            <option value="">Tous les assurés</option>
            {assures?.items.map((a) => (
              <option key={a.id} value={a.id}>
                {a.prenom} {a.nom} ({a.numero_assure})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data?.items.length ? (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-20 text-text-muted">
            <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucune consultation enregistrée</p>
            <p className="text-sm mt-1">Cliquez sur « Nouvelle consultation » pour commencer.</p>
          </div>
        ) : (
          data.items.map((c) => {
            const assure = assures?.items.find((a) => a.id === c.assure_id);
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-card transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-semibold text-navy text-sm">
                          {assure ? `${assure.prenom} ${assure.nom}` : "Assuré inconnu"}
                        </p>
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Calendar className="w-3 h-3" />
                          {new Date(c.date_consultation).toLocaleDateString("fr-FR")}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/8 px-2.5 py-0.5 rounded-full">
                          <Banknote className="w-3 h-3" />
                          {c.montant_consultation.toLocaleString("fr-FR")} FCFA
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        <span className="font-medium text-navy">Motif :</span> {c.motif}
                      </p>
                      {c.diagnostic && (
                        <p className="text-xs text-text-muted">
                          <span className="font-medium">Diagnostic :</span> {c.diagnostic}
                        </p>
                      )}
                      {c.actes_realises && (
                        <p className="text-xs text-text-muted">
                          <span className="font-medium">Actes :</span> {c.actes_realises}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="flex items-center gap-1.5 text-xs text-text-muted bg-gray-50 px-2.5 py-1 rounded-lg font-mono">
                      <FileText className="w-3 h-3" />
                      {c.id.slice(0, 8)}…
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {data && data.total > 0 && (
          <p className="text-xs text-text-muted text-right px-1">
            {data.total} consultation{data.total > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Modal création */}
      <Modal open={modalOpen} onClose={resetModal} title="Enregistrer une consultation" size="lg">
        <div className="space-y-4">

          {/* Assuré */}
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Assuré <span className="text-red-500">*</span>
            </label>
            <select
              value={form.assure_id}
              onChange={(e) => { setForm(prev => ({ ...prev, assure_id: e.target.value })); setErrors(prev => ({ ...prev, assure_id: undefined })); }}
              className={cn(inputCls(!!errors.assure_id), "bg-white")}
            >
              <option value="">-- Sélectionner un assuré --</option>
              {assures?.items.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.prenom} {a.nom} ({a.numero_assure})
                </option>
              ))}
            </select>
            {errors.assure_id && <p className="text-xs text-red-500 mt-1">{errors.assure_id}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.date_consultation}
                onChange={set("date_consultation")}
                max={new Date().toISOString().split("T")[0]}
                className={inputCls(!!errors.date_consultation)}
              />
              {errors.date_consultation && <p className="text-xs text-red-500 mt-1">{errors.date_consultation}</p>}
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Montant (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.montant_consultation || ""}
                onChange={set("montant_consultation")}
                placeholder="Ex : 15000"
                className={inputCls(!!errors.montant_consultation)}
              />
              {errors.montant_consultation && <p className="text-xs text-red-500 mt-1">{errors.montant_consultation}</p>}
            </div>
          </div>

          {/* Motif */}
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Motif de consultation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.motif}
              onChange={set("motif")}
              placeholder="Ex : Fièvre persistante, douleurs abdominales…"
              className={inputCls(!!errors.motif)}
            />
            {errors.motif && <p className="text-xs text-red-500 mt-1">{errors.motif}</p>}
          </div>

          {/* Diagnostic */}
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Diagnostic</label>
            <textarea
              value={form.diagnostic ?? ""}
              onChange={set("diagnostic")}
              rows={2}
              placeholder="Diagnostic posé lors de la consultation…"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary hover:border-gray-300 transition-all"
            />
          </div>

          {/* Actes */}
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Actes réalisés</label>
            <textarea
              value={form.actes_realises ?? ""}
              onChange={set("actes_realises")}
              rows={2}
              placeholder="Examens, soins, interventions pratiqués…"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary hover:border-gray-300 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={resetModal} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button onClick={handleSubmit} disabled={creer.isPending} className="btn-primary text-sm px-5 py-2.5">
            {creer.isPending
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Enregistrement…</span>
              : "Enregistrer la consultation"}
          </button>
        </div>
      </Modal>
    </>
  );
}
