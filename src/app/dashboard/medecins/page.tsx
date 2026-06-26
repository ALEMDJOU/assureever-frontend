"use client";

import { useState } from "react";
import { Stethoscope, Plus, Search, UserX, UserCheck, Eye, EyeOff } from "lucide-react";
import { useMedecins, useCreerMedecin, useDesactiverMedecin, useReactiverMedecin } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { InputField, SelectField } from "@/components/ui/FormField";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import type { MedecinCreate, TypeMedecin } from "@/types/api";

const EMPTY: MedecinCreate = {
  matricule: "", nom: "", prenom: "",
  type_medecin: "GENERALISTE",
  specialite: "", telephone: "",
  email: "", password: "",
};

export default function MedecinsPage() {
  const [recherche,  setRecherche]  = useState("");
  const [filtre,     setFiltre]     = useState<TypeMedecin | "">("");
  const [modalOpen,  setModalOpen]  = useState(false);
  const [form,       setForm]       = useState<MedecinCreate>(EMPTY);
  const [errors,     setErrors]     = useState<Partial<MedecinCreate>>({});
  const [showPwd,    setShowPwd]    = useState(false);

  const { data, isLoading } = useMedecins(filtre || undefined, recherche);
  const creer      = useCreerMedecin();
  const desactiver = useDesactiverMedecin();
  const reactiver  = useReactiverMedecin();
  const { success, error } = useToast();

  const validate = (): boolean => {
    const e: Partial<MedecinCreate> = {};
    if (!form.matricule.trim()) e.matricule = "Champ obligatoire";
    if (!form.nom.trim())       e.nom       = "Champ obligatoire";
    if (!form.prenom.trim())    e.prenom    = "Champ obligatoire";
    if (!form.email.trim())     e.email     = "Champ obligatoire";
    if (!form.password || form.password.length < 8) e.password = "8 caractères minimum";
    if (form.type_medecin === "SPECIALISTE" && !form.specialite?.trim())
      e.specialite = "Obligatoire pour un spécialiste";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    creer.mutate(form, {
      onSuccess: () => {
        success("Médecin enregistré avec succès");
        setModalOpen(false);
        setForm(EMPTY);
        setErrors({});
      },
      onError: (err: any) => error(err.detail ?? "Erreur lors de l'enregistrement"),
    });
  };

  const handleDesactiver = (id: string, nom: string) => {
    if (!confirm(`Désactiver le compte du Dr. ${nom} ?`)) return;
    desactiver.mutate(id, {
      onSuccess: () => success("Compte désactivé"),
      onError:   (err: any) => error(err.detail ?? "Erreur"),
    });
  };

  const handleReactiver = (id: string, nom: string) => {
    if (!confirm(`Réactiver le compte du Dr. ${nom} ?`)) return;
    reactiver.mutate(id, {
      onSuccess: () => success("Compte réactivé"),
      onError:   (err: any) => error(err.detail ?? "Erreur"),
    });
  };

  return (
    <>
      <PageHeader
        icon={Stethoscope}
        title="Gestion des médecins"
        description="Enregistrez et gérez les médecins généralistes et spécialistes"
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            Nouveau médecin
          </button>
        }
      />

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Rechercher par nom, matricule, spécialité…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {(["", "GENERALISTE", "SPECIALISTE"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFiltre(t)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                filtre === t
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-50 text-text-secondary hover:bg-gray-100"
              )}
            >
              {t === "" ? "Tous" : t === "GENERALISTE" ? "Généralistes" : "Spécialistes"}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data?.items.length ? (
          <div className="text-center py-20 text-text-muted">
            <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucun médecin trouvé</p>
            <p className="text-sm mt-1">Enregistrez le premier médecin.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Médecin", "Matricule", "Type", "Spécialité", "Téléphone", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.items.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {m.prenom.charAt(0)}{m.nom.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-navy">Dr. {m.prenom} {m.nom}</p>
                        <p className="text-xs text-text-muted">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-text-secondary">{m.matricule}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      "inline-block px-2.5 py-1 rounded-full text-xs font-semibold",
                      m.type_medecin === "GENERALISTE"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    )}>
                      {m.type_medecin === "GENERALISTE" ? "Généraliste" : "Spécialiste"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">{m.specialite ?? "—"}</td>
                  <td className="px-4 py-3.5 text-text-secondary">{m.telephone ?? "—"}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      "inline-block px-2.5 py-1 rounded-full text-xs font-semibold",
                      m.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}>
                      {m.is_active ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {m.is_active ? (
                      <button
                        onClick={() => handleDesactiver(m.id, `${m.prenom} ${m.nom}`)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
                        title="Désactiver"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactiver(m.id, `${m.prenom} ${m.nom}`)}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-text-muted hover:text-green-600 transition-colors"
                        title="Réactiver"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        {data && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-text-muted">
            {data.total} médecin{data.total > 1 ? "s" : ""} au total
          </div>
        )}
      </div>

      {/* Modal création */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setErrors({}); setForm(EMPTY); }} title="Enregistrer un médecin" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Nom" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} error={errors.nom} placeholder="Dupont" />
          <InputField label="Prénom" required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} error={errors.prenom} placeholder="Jean" />
          <InputField label="Matricule" required value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} error={errors.matricule} placeholder="MED-2024-001" />
          <SelectField label="Type" required value={form.type_medecin} onChange={(e) => setForm({ ...form, type_medecin: e.target.value as TypeMedecin })}>
            <option value="GENERALISTE">Généraliste</option>
            <option value="SPECIALISTE">Spécialiste</option>
          </SelectField>
          {form.type_medecin === "SPECIALISTE" && (
            <InputField label="Spécialité" required value={form.specialite ?? ""} onChange={(e) => setForm({ ...form, specialite: e.target.value })} error={errors.specialite} placeholder="Cardiologie" className="sm:col-span-2" />
          )}
          <InputField label="Téléphone" value={form.telephone ?? ""} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+237 6XX XXX XXX" />
          <InputField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} placeholder="medecin@clinique.cm" />
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy">
              Mot de passe<span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="8 caractères minimum"
                className={cn(
                  "w-full px-4 py-2.5 pr-11 rounded-xl border text-sm text-navy placeholder-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors",
                  errors.password ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white hover:border-gray-300"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setModalOpen(false)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button onClick={handleSubmit} disabled={creer.isPending} className="btn-primary text-sm px-5 py-2.5">
            {creer.isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </Modal>
    </>
  );
}
