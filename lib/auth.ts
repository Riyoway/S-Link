import { AuthOptions, User, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SECRET_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      if (user.email && user.email.endsWith("@ktc.ac.jp")) {
        return true;
      }
      return false;
    },
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: "/auth/error",
  },
};
