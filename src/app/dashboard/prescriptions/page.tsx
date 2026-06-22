"use client";

import { useState } from "react";
import { ClipboardList, Plus, Pill, Stethoscope } from "lucide-react";
import {
  useAssures, useMesConsultations,
  useSpecialistes, usePrescrireMedicament, usePrescrireConsultation,
} from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { SelectField } from "@/components/ui/FormField";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

type PrescriptionType = "medicament" | "consultation";

const selectCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary bg-white";
const inputCls  = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary hover:border-gray-300 transition-all";

export default function PrescriptionsPage() {
  const [type,      setType]      = useState<PrescriptionType>("medicament");
  const [modalOpen, setModalOpen] = useState(false);
  const [assureId,  setAssureId]  = useState("");

  const [medForm, setMedForm] = useState({
    consultation_id: "", nom_medicament: "", dosage: "",
    posologie: "", duree_traitement_jours: 7,
  });

  const [consultForm, setConsultForm] = useState({
    consultation_id: "", motif: "", specialiste_id: "",
  });

  const { data: assures }      = useAssures(1, 100);
  const { data: mesConsultations } = useMesConsultations(assureId || undefined);
  const { data: specialistes } = useSpecialistes();
  const prescrireMed     = usePrescrireMedicament();
  const prescrireConsult = usePrescrireConsultation();
  const { success, error } = useToast();

  const consultations = mesConsultations?.items ?? [];

  const openModal = (t: PrescriptionType) => {
    setType(t);
    setMedForm({ consultation_id: "", nom_medicament: "", dosage: "", posologie: "", duree_traitement_jours: 7 });
    setConsultForm({ consultation_id: "", motif: "", specialiste_id: "" });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (type === "medicament") {
      if (!medForm.consultation_id || !medForm.nom_medicament || !medForm.dosage || !medForm.posologie) {
        error("Veuillez remplir tous les champs obligatoires");
        return;
      }
      prescrireMed.mutate(medForm, {
        onSuccess: () => { success("Prescription médicamenteuse enregistrée"); setModalOpen(false); },
        onError:   (err: any) => error(err.detail ?? "Erreur"),
      });
    } else {
      if (!consultForm.consultation_id || !consultForm.motif) {
        error("Veuillez sélectionner une consultation et saisir le motif");
        return;
      }
      prescrireConsult.mutate(
        { ...consultForm, specialiste_id: consultForm.specialiste_id || undefined },
        {
          onSuccess: () => { success("Prescription de consultation enregistrée"); setModalOpen(false); },
          onError:   (err: any) => error(err.detail ?? "Erreur"),
        }
      );
    }
  };

  const isPending = prescrireMed.isPending || prescrireConsult.isPending;

  const ConsultationSelector = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">
        Assuré et consultation <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        <select
          value={assureId}
          onChange={(e) => { setAssureId(e.target.value); onChange(""); }}
          className={selectCls}
        >
          <option value="">-- 1. Sélectionner un assuré --</option>
          {assures?.items.map((a) => (
            <option key={a.id} value={a.id}>{a.prenom} {a.nom} ({a.numero_assure})</option>
          ))}
        </select>
        {assureId && (
          consultations.length === 0 ? (
            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
              Aucune consultation pour cet assuré. Créez-en une dans <strong>Mes consultations</strong>.
            </div>
          ) : (
            <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
              <option value="">-- 2. Sélectionner une consultation --</option>
              {consultations.map((c) => (
                <option key={c.id} value={c.id}>
                  {new Date(c.date_consultation).toLocaleDateString("fr-FR")} — {c.motif}
                </option>
              ))}
            </select>
          )
        )}
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        icon={ClipboardList}
        title="Prescriptions"
        description="Prescrivez des médicaments ou orientez vers un spécialiste"
        action={
          <div className="flex gap-2">
            <button onClick={() => openModal("medicament")} className="btn-primary text-sm">
              <Plus className="w-4 h-4" />
              Médicament
            </button>
            <button onClick={() => openModal("consultation")} className="btn-outline text-sm">
              <Plus className="w-4 h-4" />
              Spécialiste
            </button>
          </div>
        }
      />

      {/* Cartes de type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-xl">
        {([
          { key: "medicament",   label: "Prescription médicamenteuse", icon: Pill,        desc: "Médicaments, dosages et posologies" },
          { key: "consultation", label: "Consultation spécialiste",     icon: Stethoscope, desc: "Orientation vers un médecin spécialiste" },
        ] as const).map((item) => (
          <button
            key={item.key}
            onClick={() => openModal(item.key)}
            className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-primary/30 hover:shadow-card-hover transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold text-navy text-sm">{item.label}</p>
            <p className="text-xs text-text-muted mt-1">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-surface border border-primary/15 rounded-2xl p-5">
        <p className="text-sm text-text-secondary">
          Les prescriptions sont liées à une consultation. Sélectionnez l'assuré puis la consultation
          correspondante lors de la création.
        </p>
      </div>

      {/* ══ MODAL MÉDICAMENT ══ */}
      <Modal
        open={modalOpen && type === "medicament"}
        onClose={() => setModalOpen(false)}
        title="Prescrire un médicament"
        size="lg"
      >
        <div className="space-y-4">
          <ConsultationSelector
            value={medForm.consultation_id}
            onChange={(v) => setMedForm(f => ({ ...f, consultation_id: v }))}
          />
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Nom du médicament <span className="text-red-500">*</span>
            </label>
            <input
              type="text" value={medForm.nom_medicament}
              onChange={(e) => setMedForm(f => ({ ...f, nom_medicament: e.target.value }))}
              placeholder="Ex : Paracétamol"
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Dosage <span className="text-red-500">*</span>
              </label>
              <input
                type="text" value={medForm.dosage}
                onChange={(e) => setMedForm(f => ({ ...f, dosage: e.target.value }))}
                placeholder="Ex : 500mg"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Durée (jours) <span className="text-red-500">*</span>
              </label>
              <input
                type="number" min="1" value={medForm.duree_traitement_jours}
                onChange={(e) => setMedForm(f => ({ ...f, duree_traitement_jours: parseInt(e.target.value) }))}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Posologie <span className="text-red-500">*</span>
            </label>
            <textarea
              value={medForm.posologie}
              onChange={(e) => setMedForm(f => ({ ...f, posologie: e.target.value }))}
              rows={2}
              placeholder="Ex : 2 comprimés matin et soir pendant les repas"
              className={cn(inputCls, "resize-none")}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setModalOpen(false)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button onClick={handleSubmit} disabled={isPending} className="btn-primary text-sm px-5 py-2.5">
            {isPending ? "Enregistrement…" : "Prescrire"}
          </button>
        </div>
      </Modal>

      {/* ══ MODAL CONSULTATION SPÉCIALISTE ══ */}
      <Modal
        open={modalOpen && type === "consultation"}
        onClose={() => setModalOpen(false)}
        title="Prescrire une consultation spécialiste"
      >
        <div className="space-y-4">
          <ConsultationSelector
            value={consultForm.consultation_id}
            onChange={(v) => setConsultForm(f => ({ ...f, consultation_id: v }))}
          />
          <SelectField
            label="Spécialiste (optionnel)"
            value={consultForm.specialiste_id}
            onChange={(e) => setConsultForm(f => ({ ...f, specialiste_id: e.target.value }))}
          >
            <option value="">-- Aucun spécialiste sélectionné --</option>
            {specialistes?.items.map((s) => (
              <option key={s.id} value={s.id}>
                Dr. {s.prenom} {s.nom} — {s.specialite}
              </option>
            ))}
          </SelectField>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Motif <span className="text-red-500">*</span>
            </label>
            <textarea
              value={consultForm.motif}
              onChange={(e) => setConsultForm(f => ({ ...f, motif: e.target.value }))}
              rows={3}
              placeholder="Raison de l'orientation spécialisée…"
              className={cn(inputCls, "resize-none")}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setModalOpen(false)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !consultForm.motif}
            className="btn-primary text-sm px-5 py-2.5"
          >
            {isPending ? "Enregistrement…" : "Prescrire"}
          </button>
        </div>
      </Modal>
    </>
  );
}
