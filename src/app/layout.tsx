import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AssureEver — Votre santé, notre engagement",
  description:
    "Plateforme digitale de gestion de la sécurité sociale. Gestion des assurés, médecins, consultations, feuilles de maladie et remboursements.",
  keywords: ["sécurité sociale", "assurance santé", "remboursement médical", "assureever"],
  openGraph: {
    title: "AssureEver — Votre santé, notre engagement",
    description: "Plateforme digitale de gestion de la sécurité sociale.",
    siteName: "AssureEver",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
