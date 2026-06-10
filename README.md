# AssureEver — Frontend

Interface web Next.js 16 pour la plateforme de gestion de la sécurité sociale AssureEver.

> Dépôt backend : [assureever-api](https://github.com/ALEMDJOU/assureever-api)

## Stack technique

| Composant      | Technologie                    |
|----------------|-------------------------------|
| Framework      | Next.js 16.2 (App Router)     |
| Language       | TypeScript                    |
| Styles         | Tailwind CSS 3.4              |
| Auth           | NextAuth.js v5                |
| Data fetching  | TanStack Query v5             |
| Icons          | Lucide React                  |
| Déploiement    | Vercel                        |

---

## Pages

| Route                        | Acteur    | Description                           |
|------------------------------|-----------|---------------------------------------|
| `/`                          | Public    | Landing page                          |
| `/auth/login`                | Tous      | Connexion                             |
| `/auth/register`             | Tous      | Demande d'accès                       |
| `/dashboard`                 | Tous      | Tableau de bord                       |
| `/dashboard/medecins`        | ASSUREUR  | Gestion des médecins (UC0)            |
| `/dashboard/assures`         | ASSUREUR  | Gestion des assurés (UC1, UC2)        |
| `/dashboard/feuilles-maladie`| Tous      | Feuilles de maladie (UC5, UC6)        |
| `/dashboard/prescriptions`   | MEDECIN   | Prescriptions (UC7, UC8)              |
| `/dashboard/remboursements`  | ASSUREUR  | Remboursements et factures (UC3, UC4) |

---

## Cas d'utilisation couverts

| UC  | Acteur                 | Description                                     |
|-----|------------------------|-------------------------------------------------|
| UC0 | **Assureur**           | Enregistrer un médecin (généraliste/spécialiste)|
| UC1 | **Assureur**           | Inscrire un assuré                              |
| UC2 | **Assureur**           | Enregistrer un médecin traitant pour un assuré  |
| UC3 | **Assureur**           | Effectuer un remboursement                      |
| UC4 | **Assureur**           | Imprimer / télécharger une facture PDF          |
| UC5 | **Assureur**           | Compléter une feuille de maladie                |
| UC6 | **Médecin**            | Enregistrer une feuille de maladie              |
| UC7 | **Médecin**            | Prescrire un médicament                         |
| UC8 | **Médecin**            | Prescrire une consultation chez un spécialiste  |
| UC9 | **Assureur + Médecin** | S'authentifier                                  |

> **Note — UC0 :**
> L'enregistrement des médecins est absent du cahier d'analyse original.
> C'est l'**Assureur** qui inscrit les médecins (généralistes et spécialistes),
> comme il inscrit les assurés. Voir la documentation complète dans le README du backend.

---

## Installation

```bash
git clone https://github.com/ALEMDJOU/assureever-frontend.git
cd assureever-frontend

npm install

cp .env.local.example .env.local
# Éditer .env.local

npm run dev
```

Application accessible sur `http://localhost:3000`.

---

## Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-min-32-chars
```

> `NEXTAUTH_SECRET` doit être **identique** à la valeur configurée côté backend.

---

## Déploiement Vercel

1. Connecter ce dépôt GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel
3. Vercel détecte Next.js automatiquement et déploie

---

## Auteurs

Projet tutoré 3GI — Conception des Systèmes d'Information
Supervisé par Dr. Anne Marie CHANA et Dr. Jaures Styve KAMENI
