import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Appel vers l'endpoint d'authentification FastAPI
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email:    credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!res.ok) return null;

          const data = await res.json();
          // FastAPI retourne : { access_token, user: { id, nom, prenom, email, role } }
          return {
            id:          data.user.id,
            name:        `${data.user.prenom} ${data.user.nom}`,
            email:       data.user.email,
            role:        data.user.role,
            accessToken: data.access_token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id          = user.id;
        token.role        = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id          = token.id as string;
      (session.user as any).role        = token.role;
      (session.user as any).accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn:  "/auth/login",
    error:   "/auth/login",
  },

  session: { strategy: "jwt" },
});
