"use client";

import { useState } from "react";
import { Users, Plus, Search, Eye, UserCheck } from "lucide-react";
import { useAssures, useCreerAssure, useGeneralistes, useAssocierMedecinTraitant } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { InputField, SelectField } from "@/components/ui/FormField";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import type { AssureCreate } from "@/types/api";

const EMPTY: AssureCreate = { nom: "", prenom: "", date_naissance: "", adresse: "", telephone: "", email: "" };

export default function AssuresPage() {
  const [page,          setPage]         = useState(1);
  const [recherche,     setRecherche]    = useState("");
  const [modalOpen,     setModalOpen]    = useState(false);
  const [medecinModal,  setMedecinModal] = useState<string | null>(null);
  const [form,          setForm]         = useState<AssureCreate>(EMPTY);
  const [errors,        setErrors]       = useState<Partial<AssureCreate>>({});
  const [medecinChoisi, setMedecinChoisi] = useState("");

  const { data, isLoading } = useAssures(page, 20, recherche);
  const { data: generalistes } = useGeneralistes();
  const creer            = useCreerAssure();
  const associerMedecin  = useAssocierMedecinTraitant();
  const { success, error } = useToast();

  const validate = (): boolean => {
    const e: Partial<AssureCreate> = {};
    if (!form.nom.trim())            e.nom            = "Champ obligatoire";
    if (!form.prenom.trim())         e.prenom         = "Champ obligatoire";
    if (!form.date_naissance)        e.date_naissance = "Champ obligatoire";
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
      onError: (err: any) => error(err.detail ?? "Erreur lors de l'inscription"),
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

      {/* Barre de recherche */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou numéro…"
            value={recherche}
            onChange={(e) => { setRecherche(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
          />
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
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucun assuré trouvé</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Assuré", "N° Assuré", "Date de naissance", "Téléphone", "Médecin traitant", "Actions"].map((h) => (
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
                  <td className="px-4 py-3.5 text-text-secondary">
                    {new Date(a.date_naissance).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">{a.telephone ?? "—"}</td>
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
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setMedecinModal(a.id)}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                        title="Assigner médecin traitant"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {data && data.total > 20 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
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

      {/* Modal inscription */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setForm(EMPTY); setErrors({}); }} title="Inscrire un nouvel assuré" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Nom" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} error={errors.nom} placeholder="Dupont" />
          <InputField label="Prénom" required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} error={errors.prenom} placeholder="Jean" />
          <InputField label="Date de naissance" type="date" required value={form.date_naissance} onChange={(e) => setForm({ ...form, date_naissance: e.target.value })} error={errors.date_naissance} className="col-span-2" />
          <InputField label="Téléphone" value={form.telephone ?? ""} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+237 6XX XXX XXX" />
          <InputField label="Email" type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jean.dupont@email.cm" />
          <InputField label="Adresse" value={form.adresse ?? ""} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="Yaoundé, Centre" className="col-span-2" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setModalOpen(false)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button onClick={handleSubmit} disabled={creer.isPending} className="btn-primary text-sm px-5 py-2.5">
            {creer.isPending ? "Inscription…" : "Inscrire"}
          </button>
        </div>
      </Modal>

      {/* Modal médecin traitant */}
      <Modal open={!!medecinModal} onClose={() => setMedecinModal(null)} title="Assigner un médecin traitant" size="sm">
        <p className="text-sm text-text-secondary mb-4">
          Sélectionnez un médecin généraliste à désigner comme médecin traitant.
        </p>
        <SelectField label="Médecin généraliste" value={medecinChoisi} onChange={(e) => setMedecinChoisi(e.target.value)}>
          <option value="">-- Choisir un médecin --</option>
          {generalistes?.items.map((m) => (
            <option key={m.id} value={m.id}>Dr. {m.prenom} {m.nom}</option>
          ))}
        </SelectField>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setMedecinModal(null)} className="btn-outline text-sm px-5 py-2.5">Annuler</button>
          <button onClick={handleAssocierMedecin} disabled={!medecinChoisi || associerMedecin.isPending} className="btn-primary text-sm px-5 py-2.5">
            {associerMedecin.isPending ? "Enregistrement…" : "Confirmer"}
          </button>
        </div>
      </Modal>
    </>
  );
}
