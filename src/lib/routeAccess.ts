export type Role = "ASSUREUR" | "MEDECIN";

/**
 * Rôles autorisés par préfixe de route sous /dashboard.
 * Source unique utilisée par le middleware (contrôle d'accès serveur)
 * et par la navigation (affichage des liens).
 */
export const ROUTE_ROLES: Record<string, Role[]> = {
  "/dashboard":                  ["ASSUREUR", "MEDECIN"],
  "/dashboard/assures":          ["ASSUREUR"],
  "/dashboard/medecins":         ["ASSUREUR"],
  "/dashboard/consultations":    ["MEDECIN"],
  "/dashboard/feuilles-maladie": ["ASSUREUR", "MEDECIN"],
  "/dashboard/prescriptions":    ["MEDECIN"],
  "/dashboard/remboursements":   ["ASSUREUR"],
};

/** Renvoie les rôles autorisés pour un chemin donné (correspondance par préfixe le plus spécifique). */
export function getAllowedRoles(pathname: string): Role[] | undefined {
  const match = Object.keys(ROUTE_ROLES)
    .filter((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match ? ROUTE_ROLES[match] : undefined;
}
