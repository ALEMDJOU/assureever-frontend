"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { assuresApi, medecinsApi, consultationsApi, feuillesApi, remboursementsApi, prescriptionsApi } from "@/lib/queries";
import type { AssureCreate, MedecinCreate, ConsultationCreate,
  FeuilleMaladieCreate, RemboursementCreate,
  PrescriptionMedicamentCreate, PrescriptionConsultationCreate,
  TypeMedecin } from "@/types/api";

function useToken(): string {
  const { data: session } = useSession();
  return (session?.user as any)?.accessToken ?? "";
}

// ─── Assurés ──────────────────────────────────────────────────────────────────

export function useAssures(page = 1, size = 20, recherche = "") {
  const token = useToken();
  return useQuery({
    queryKey: ["assures", page, size, recherche],
    queryFn: () => assuresApi.lister(token, page, size, recherche),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useAssure(id: string) {
  const token = useToken();
  return useQuery({
    queryKey: ["assure", id],
    queryFn: () => assuresApi.getById(token, id),
    enabled: !!token && !!id,
  });
}

export function useCreerAssure() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssureCreate) => assuresApi.creer(token, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assures"] }),
  });
}

export function useAssocierMedecinTraitant() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ assureId, medecinId }: { assureId: string; medecinId: string }) =>
      assuresApi.associerMedecinTraitant(token, assureId, medecinId),
    onSuccess: (_, { assureId }) => {
      qc.invalidateQueries({ queryKey: ["assure", assureId] });
      qc.invalidateQueries({ queryKey: ["assures"] });
    },
  });
}

// ─── Médecins ─────────────────────────────────────────────────────────────────

export function useMedecins(type?: TypeMedecin, recherche = "") {
  const token = useToken();
  return useQuery({
    queryKey: ["medecins", type, recherche],
    queryFn: () => medecinsApi.lister(token, type, recherche),
    enabled: !!token,
    staleTime: 60_000,
  });
}

export function useGeneralistes() {
  const token = useToken();
  return useQuery({
    queryKey: ["medecins", "GENERALISTE"],
    queryFn: () => medecinsApi.listerGeneralistes(token),
    enabled: !!token,
    staleTime: 60_000,
  });
}

export function useSpecialistes(specialite = "") {
  const token = useToken();
  return useQuery({
    queryKey: ["medecins", "SPECIALISTE", specialite],
    queryFn: () => medecinsApi.listerSpecialistes(token, specialite),
    enabled: !!token,
    staleTime: 60_000,
  });
}

export function useCreerMedecin() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MedecinCreate) => medecinsApi.creer(token, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medecins"] }),
  });
}

export function useDesactiverMedecin() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medecinsApi.desactiver(token, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medecins"] }),
  });
}

// ─── Consultations ────────────────────────────────────────────────────────────

export function useMesConsultations(assureId?: string) {
  const token = useToken();
  return useQuery({
    queryKey: ["consultations", "mes", assureId],
    queryFn: () => consultationsApi.mesConsultations(token, assureId),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useConsultationsAssure(assureId: string) {
  const token = useToken();
  return useQuery({
    queryKey: ["consultations", "assure", assureId],
    queryFn: () => consultationsApi.parAssure(token, assureId),
    enabled: !!token && !!assureId,
    staleTime: 30_000,
  });
}

export function useCreerConsultation() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ConsultationCreate) => consultationsApi.creer(token, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["consultations"] }),
  });
}

// ─── Feuilles de maladie ──────────────────────────────────────────────────────

export function useFeuillesAssure(assureId: string) {
  const token = useToken();
  return useQuery({
    queryKey: ["feuilles", assureId],
    queryFn: () => feuillesApi.listerParAssure(token, assureId),
    enabled: !!token && !!assureId,
  });
}

export function useFeuillesEnAttente(assureId: string) {
  const token = useToken();
  return useQuery({
    queryKey: ["feuilles", "en-attente", assureId],
    queryFn: () => feuillesApi.listerEnAttente(token, assureId),
    enabled: !!token && !!assureId,
  });
}

export function useCreerFeuille() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FeuilleMaladieCreate) => feuillesApi.creer(token, data),
    onSuccess: (_, data) => qc.invalidateQueries({ queryKey: ["feuilles", data.assure_id] }),
  });
}

export function useCompleterFeuille() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FeuilleMaladieCreate> }) =>
      feuillesApi.completer(token, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feuilles"] }),
  });
}

export function useTelechargerFeuillePdf() {
  const token = useToken();
  return useMutation({
    mutationFn: ({ id, filename }: { id: string; filename: string }) =>
      feuillesApi.telechargerPdf(token, id, filename),
  });
}

// ─── Remboursements ───────────────────────────────────────────────────────────

export function useRemboursements(assureId: string) {
  const token = useToken();
  return useQuery({
    queryKey: ["remboursements", assureId],
    queryFn: () => remboursementsApi.listerParAssure(token, assureId),
    enabled: !!token && !!assureId,
  });
}

export function useEffectuerRemboursement() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RemboursementCreate) => remboursementsApi.effectuer(token, data),
    onSuccess: (_, data) => {
      qc.invalidateQueries({ queryKey: ["remboursements", data.assure_id] });
      qc.invalidateQueries({ queryKey: ["feuilles"] });
    },
  });
}

export function useTelechargerFacture() {
  const token = useToken();
  return useMutation({
    mutationFn: ({ id, filename }: { id: string; filename: string }) =>
      remboursementsApi.telechargerFacture(token, id, filename),
  });
}

// ─── Prescriptions ────────────────────────────────────────────────────────────

export function usePrescrireMedicament() {
  const token = useToken();
  return useMutation({
    mutationFn: (data: PrescriptionMedicamentCreate) =>
      prescriptionsApi.prescrireMedicament(token, data),
  });
}

export function usePrescrireConsultation() {
  const token = useToken();
  return useMutation({
    mutationFn: (data: PrescriptionConsultationCreate) =>
      prescriptionsApi.prescrireConsultation(token, data),
  });
}
