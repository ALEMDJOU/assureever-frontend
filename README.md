# AssureEver — Frontend

Interface web Next.js 16 pour la plateforme de gestion de la sécurité sociale AssureEver.

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

## Pages

| Route                  | Description                   |
|------------------------|-------------------------------|
| `/`                    | Landing page publique          |
| `/auth/login`          | Connexion                     |
| `/auth/register`       | Demande d'accès               |
| `/dashboard`           | Tableau de bord               |
| `/dashboard/assures`   | Gestion des assurés           |
| `/dashboard/medecins`  | Gestion des médecins          |

## Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.local.example .env.local
# Éditer .env.local

# Lancer en développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

## Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-min-32-chars
```

## Connexion avec le backend

Le backend FastAPI doit tourner sur `http://localhost:8000`.
Voir le dépôt : [assureever-api](https://github.com/ALEMDJOU/assureever-api)

## Déploiement Vercel

1. Connecter ce dépôt GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel
3. Vercel détecte automatiquement Next.js et déploie

## Auteurs

Projet tutoré 3GI — Conception des Systèmes d'Information
