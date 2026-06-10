/**
 * Route Handler Next.js — POST /api/auth/register
 *
 * Proxie la requête d'inscription vers FastAPI côté serveur.
 * L'appel serveur→serveur ne passe pas par le navigateur,
 * donc il n'est PAS soumis à la politique CORS du browser.
 * C'est la solution correcte pour tous les appels publics
 * (sans token) depuis des pages "use client".
 */

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { detail: "Impossible de contacter le serveur. Vérifiez que le backend est démarré." },
      { status: 503 }
    );
  }
}
