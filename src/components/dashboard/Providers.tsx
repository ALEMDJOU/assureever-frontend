"use client";

import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { ToastProvider } from "@/components/ui/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Persiste hors du cycle de vie du composant (module-scope, comme queryClient)
// afin de survivre aux remounts du layout dashboard entre deux connexions.
let lastSeenUserId: string | undefined;

/**
 * Aucune clé de requête (useApi.ts) n'inclut l'identité de l'utilisateur.
 * Si un médecin/assureur se reconnecte avec un autre compte sans rechargement
 * complet de page, le cache React Query continuerait de servir les données
 * du compte précédent jusqu'à expiration de leur staleTime. On vide donc tout
 * le cache dès qu'on détecte que l'utilisateur authentifié a changé.
 */
function CacheResetOnUserChange({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const qc = useQueryClient();

  useEffect(() => {
    if (status === "loading") return;
    const currentId = (session?.user as any)?.id as string | undefined;
    if (lastSeenUserId !== undefined && lastSeenUserId !== currentId) {
      qc.clear();
    }
    lastSeenUserId = currentId;
  }, [session, status, qc]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CacheResetOnUserChange>
          <ToastProvider>
            {children}
          </ToastProvider>
        </CacheResetOnUserChange>
      </QueryClientProvider>
    </SessionProvider>
  );
}
