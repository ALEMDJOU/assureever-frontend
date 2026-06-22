import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllowedRoles, type Role } from "@/lib/routeAccess";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const role = (session?.user as any)?.role as Role | undefined;

  // Non authentifié : on ne le laisse pas atterrir sur la page protégée,
  // on le renvoie vers la connexion avec un indicateur d'erreur pour le toast.
  if (!session) {
    const loginUrl = new URL("/auth/login", nextUrl);
    loginUrl.searchParams.set("error", "unauthenticated");
    return NextResponse.redirect(loginUrl);
  }

  // Authentifié mais rôle non autorisé pour cette route : on le renvoie sur
  // son propre tableau de bord (pas sur la page demandée) + indicateur d'erreur.
  const allowedRoles = getAllowedRoles(nextUrl.pathname);
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const homeUrl = new URL("/dashboard", nextUrl);
    homeUrl.searchParams.set("error", "forbidden");
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
