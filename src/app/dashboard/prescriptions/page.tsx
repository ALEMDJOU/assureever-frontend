"use client";

import { useState } from "react";
import { ClipboardList, Plus, Pill, Stethoscope } from "lucide-react";
import { useAssures, useSpecialistes, usePrescrireMedicament, usePrescrireConsultation } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { InputField, SelectField } from "@/components/ui/FormField";
import PageHeader from "@/components/dashboard/PageHeader";

type PrescriptionType = "medicament" | "consultation";

export default function PrescriptionsPage() {
  const [type,     setType]     = useState<PrescriptionType>("medicament");
  const [modalOpen,setModalOpen] = useState(false);

  // Médicament
  const [medForm, setMedForm] = useState({
    consultation_id: "", nom_medicament: "", dosage: "",
    posologie: "", duree_traitement_jours: 7,
  });

  // Consultation spécialiste
  const [consultForm, setConsultForm] = useState({
    consultation_id: "", motif: "", specialiste_id: "",
  });

  const { data: specialistes } = useSpecialistes();
  const prescrireMed     = usePrescrireMedicament();
  const prescrireConsult = usePrescrireConsultation();
  const { success, error } = useToast();

  const handleSubmit = () => {
    if (type === "medicament") {
      prescrireMed.mutate(medForm, {
        onSuccess: () => {
          success("Prescription médicamenteuse enregistrée");
          setModalOpen(false);
          setMedForm({ consultation_id: "", nom_medicament: "", dosage: "", posologie: "", duree_traitement_jours: 7 });
        },
        onError: (err: any) => error(err.detail ?? "Erreur"),
      });
    } else {
      prescrireConsult.mutate(
        { ...consultForm, specialiste_id: consultForm.specialiste_id || undefined },
        {
          onSuccess: () => {
            success("Prescription de consultation enregistrée");
            setModalOpen(false);
            setConsultForm({ consultation_id: "", motif: "", specialiste_id: "" });
          },
          onError: (err: any) => error(err.detail ?? "Erreur"),
        }
      );
    }
  };

  const isPending = prescrireMed.isPending || prescrireConsult.isPending;

  return (
    <>
      <PageHeader
        icon={ClipboardList}
        title="Prescriptions"
        description="Prescrivez des médicaments ou orientez vers un spécialiste"
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            Nouvelle prescription
          </button>
        }
      />

      {/* Type selector */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-xl">
        {([
          { key: "medicament",   label: "Prescription médicamenteuse", icon: Pill,       desc: "Médicaments, dosages et posologies" },
          { key: "consultation", label: "Consultation spécialiste",     icon: Stethoscope, desc: "Orientation vers un médecin spécialiste" },
        ] as const).map((item) => (
          <button
            key={item.key}
            onClick={() => { setType(item.key); setModalOpen(true); }}
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

      {/* Info */}
      <div className="bg-surface border border-primary/15 rounded-2xl p-5">
        <p className="text-sm text-text-secondary">
          Les prescriptions sont liées à une consultation existante via son identifiant.
          Assurez-vous que la consultation est bien enregistrée dans le système avant de prescrire.
        </p>
      </div>

      {/* Modal médicament */}
      <Modal
        open={modalOpen && type === "medicament"}
        onClose={() => setModalOpen(false)}
        title="Prescrire un médicament"
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <InputField label="ID Consultation" required value={medForm.consultation_id}
            onChange={(e) => setMedForm({ ...medForm, consultation_id: e.target.value })}
            placeholder="UUID de la consultation" className="col-span-2" />
          <InputField label="Nom du médicament" required value={medForm.nom_medicament}
            onChange={(e) => setMedForm({ ...medForm, nom_medicament: e.target.value })}
            placeholder="Ex: Paracétamol" className="col-span-2" />
          <InputField label="Dosage" required value={medForm.dosage}
            onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
            placeholder="Ex: 500mg" />
          <InputField label="Durée du traitement (jours)" type="number" required
            value={medForm.duree_traitement_jours}
            onChange={(e) => setMedForm({ ...medForm, duree_traitement_jours: parseInt(e.target.value) })} />
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy">Posologie <span className="text-red-500">*</span></label>
            <textarea value={medForm.posologie} onChange={(e) => setMedForm({ ...medForm, posologie: e.target.value })}
              rows={2} placeholder="Ex: 2 comprimés matin et soir pendant les repas"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setModalOpen(false)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button onClick={handleSubmit} disabled={isPending} className="btn-primary text-sm px-5 py-2.5">
            {isPending ? "Enregistrement…" : "Prescrire"}
          </button>
        </div>
      </Modal>

      {/* Modal consultation spécialiste */}
      <Modal
        open={modalOpen && type === "consultation"}
        onClose={() => setModalOpen(false)}
        title="Prescrire une consultation spécialiste"
      >
        <div className="space-y-4">
          <InputField label="ID Consultation" required value={consultForm.consultation_id}
            onChange={(e) => setConsultForm({ ...consultForm, consultation_id: e.target.value })}
            placeholder="UUID de la consultation en cours" />
          <SelectField label="Spécialiste (optionnel)" value={consultForm.specialiste_id}
            onChange={(e) => setConsultForm({ ...consultForm, specialiste_id: e.target.value })}>
            <option value="">-- Aucun spécialiste sélectionné --</option>
            {specialistes?.items.map((s) => (
              <option key={s.id} value={s.id}>
                Dr. {s.prenom} {s.nom} — {s.specialite}
              </option>
            ))}
          </SelectField>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy">Motif de la consultation <span className="text-red-500">*</span></label>
            <textarea value={consultForm.motif} onChange={(e) => setConsultForm({ ...consultForm, motif: e.target.value })}
              rows={3} placeholder="Raison de l'orientation spécialisée…"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setModalOpen(false)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button onClick={handleSubmit} disabled={isPending || !consultForm.motif} className="btn-primary text-sm px-5 py-2.5">
            {isPending ? "Enregistrement…" : "Prescrire"}
          </button>
        </div>
      </Modal>
    </>
  );
}
