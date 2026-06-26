import { api } from "./api";
import type {
  Assure, AssureCreate, AssureListResponse,
  Medecin, MedecinCreate, MedecinListResponse,
  Consultation, ConsultationCreate, ConsultationListResponse,
  FeuilleMaladie, FeuilleMaladieCreate,
  PrescriptionMedicamentCreate, PrescriptionConsultationCreate,
  Remboursement, RemboursementCreate, RemboursementListResponse,
  TypeMedecin,
} from "@/types/api";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: { id: string; nom: string; prenom: string; email: string; role: string };
}

export const authApi = {
  loginMedecin: (email: string, password: string) =>
    api.post<TokenResponse>("/auth/login/medecin", { email, password }),

  loginAssureur: (email: string, password: string) =>
    api.post<TokenResponse>("/auth/login/assureur", { email, password }),

  /**
   * Inscription assureur — passe par le Route Handler Next.js /api/auth/register
   * qui proxie vers FastAPI côté serveur, évitant le blocage CORS du navigateur.
   */
  register: async (data: {
    nom: string; prenom: string; email: string; password: string;
  }): Promise<TokenResponse> => {
    const res = await fetch("/api/auth/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      const { ApiException } = await import("./api");
      throw new ApiException(res.status, json.detail ?? "Erreur lors de l'inscription", json.erreurs);
    }
    return json as TokenResponse;
  },
};

// ─── Assurés ──────────────────────────────────────────────────────────────────

export const assuresApi = {
  lister: (token: string, page = 1, size = 20, recherche = "") =>
    api.get<AssureListResponse>(
      `/assures?page=${page}&size=${size}&recherche=${encodeURIComponent(recherche)}`,
      token
    ),
  creer: (token: string, data: AssureCreate) =>
    api.post<Assure>("/assures", data, token),
  getById: (token: string, id: string) =>
    api.get<Assure>(`/assures/${id}`, token),
  associerMedecinTraitant: (token: string, assureId: string, medecinId: string) =>
    api.put<Assure>(`/assures/${assureId}/medecin-traitant`, { medecin_id: medecinId }, token),
};

// ─── Médecins ─────────────────────────────────────────────────────────────────

export const medecinsApi = {
  lister: (token: string, type?: TypeMedecin, recherche = "") => {
    const params = new URLSearchParams();
    if (type) params.set("type_medecin", type);
    if (recherche) params.set("recherche", recherche);
    return api.get<MedecinListResponse>(`/medecins?${params}`, token);
  },
  listerGeneralistes: (token: string) =>
    api.get<MedecinListResponse>("/medecins/generalistes", token),
  listerSpecialistes: (token: string, specialite = "") =>
    api.get<MedecinListResponse>(
      `/medecins/specialistes${specialite ? `?specialite=${encodeURIComponent(specialite)}` : ""}`,
      token
    ),
  creer: (token: string, data: MedecinCreate) =>
    api.post<Medecin>("/medecins", data, token),
  getById: (token: string, id: string) =>
    api.get<Medecin>(`/medecins/${id}`, token),
  desactiver: (token: string, id: string) =>
    api.delete<{ message: string }>(`/medecins/${id}`, token),
  reactiver: (token: string, id: string) =>
    api.post<{ message: string }>(`/medecins/${id}/reactiver`, null, token),
};

// ─── Consultations ────────────────────────────────────────────────────────────

export const consultationsApi = {
  creer: (token: string, data: ConsultationCreate) =>
    api.post<Consultation>("/consultations", data, token),
  mesConsultations: (token: string, assureId?: string) => {
    const params = assureId ? `?assure_id=${assureId}` : "";
    return api.get<ConsultationListResponse>(`/consultations/mes-consultations${params}`, token);
  },
  parAssure: (token: string, assureId: string) =>
    api.get<ConsultationListResponse>(`/consultations/assure/${assureId}`, token),
  getById: (token: string, id: string) =>
    api.get<Consultation>(`/consultations/${id}`, token),
};

// ─── Feuilles de maladie ──────────────────────────────────────────────────────

export const feuillesApi = {
  listerParAssure: (token: string, assureId: string) =>
    api.get<FeuilleMaladie[]>(`/feuilles-maladie/assure/${assureId}`, token),
  listerEnAttente: (token: string, assureId: string) =>
    api.get<FeuilleMaladie[]>(`/feuilles-maladie/assure/${assureId}/en-attente`, token),
  creer: (token: string, data: FeuilleMaladieCreate) =>
    api.post<FeuilleMaladie>("/feuilles-maladie", data, token),
  completer: (token: string, id: string, data: Partial<FeuilleMaladieCreate>) =>
    api.patch<FeuilleMaladie>(`/feuilles-maladie/${id}`, data, token),
  telechargerPdf: (token: string, id: string, filename: string) =>
    api.downloadFile(`/feuilles-maladie/${id}/pdf`, filename, token),
};

// ─── Prescriptions ────────────────────────────────────────────────────────────

export const prescriptionsApi = {
  prescrireMedicament: (token: string, data: PrescriptionMedicamentCreate) =>
    api.post("/prescriptions/medicament", data, token),
  prescrireConsultation: (token: string, data: PrescriptionConsultationCreate) =>
    api.post("/prescriptions/consultation-specialiste", data, token),
};

// ─── Remboursements ───────────────────────────────────────────────────────────

export const remboursementsApi = {
  listerParAssure: (token: string, assureId: string) =>
    api.get<RemboursementListResponse>(`/remboursements/assure/${assureId}`, token),
  effectuer: (token: string, data: RemboursementCreate) =>
    api.post<Remboursement>("/remboursements", data, token),
  telechargerFacture: (token: string, id: string, filename: string) =>
    api.downloadFile(`/remboursements/${id}/facture`, filename, token),
};
