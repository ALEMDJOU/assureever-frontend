// ─── Enums ───────────────────────────────────────────────────────────────────

export type Role            = "ASSUREUR" | "MEDECIN";
export type TypeMedecin     = "GENERALISTE" | "SPECIALISTE";
export type StatutFeuille   = "EN_ATTENTE" | "COMPLETE" | "REMBOURSEE";
export type ModePaiement    = "VIREMENT_BANCAIRE" | "ESPECES";
export type StatutRemboursement = "EN_ATTENTE" | "PAYE" | "ANNULE";
export type TypePrescription = "MEDICAMENT" | "CONSULTATION_SPECIALISTE";

// ─── Assurés ─────────────────────────────────────────────────────────────────

export interface Assure {
  id: string;
  numero_assure: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  medecin_traitant_id: string | null;
  created_at: string;
}

export interface AssureCreate {
  nom: string;
  prenom: string;
  date_naissance: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

export interface AssureListResponse {
  total: number;
  page: number;
  size: number;
  items: Assure[];
}

// ─── Médecins ─────────────────────────────────────────────────────────────────

export interface Medecin {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  type_medecin: TypeMedecin;
  specialite: string | null;
  telephone: string | null;
  email: string | null;
  created_at: string;
}

export interface MedecinCreate {
  matricule: string;
  nom: string;
  prenom: string;
  type_medecin: TypeMedecin;
  specialite?: string;
  telephone?: string;
  email: string;
  password: string;
}

export interface MedecinListResponse {
  total: number;
  items: Medecin[];
}

// ─── Feuilles de maladie ──────────────────────────────────────────────────────

export interface FeuilleMaladie {
  id: string;
  assure_id: string;
  consultation_id: string;
  statut: StatutFeuille;
  montant_consultation: number;
  observations: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeuilleMaladieCreate {
  assure_id: string;
  consultation_id: string;
  montant_consultation: number;
  observations?: string;
}

// ─── Prescriptions ────────────────────────────────────────────────────────────

export interface PrescriptionMedicamentCreate {
  consultation_id: string;
  nom_medicament: string;
  dosage: string;
  posologie: string;
  duree_traitement_jours: number;
}

export interface PrescriptionConsultationCreate {
  consultation_id: string;
  motif: string;
  specialiste_id?: string;
}

// ─── Remboursements ───────────────────────────────────────────────────────────

export interface Remboursement {
  id: string;
  assure_id: string;
  feuille_maladie_id: string;
  taux_remboursement: number;
  montant_consultation: number;
  montant_rembourse: number;
  mode_paiement: ModePaiement;
  statut: StatutRemboursement;
  reference_virement: string | null;
  date_remboursement: string;
  created_at: string;
}

export interface RemboursementCreate {
  assure_id: string;
  feuille_maladie_id: string;
  mode_paiement: ModePaiement;
  reference_virement?: string;
}

export interface RemboursementListResponse {
  total: number;
  items: Remboursement[];
}

// ─── Erreur API ───────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
  erreurs?: { champ: string; message: string }[];
}
