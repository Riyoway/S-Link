import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // メールドメインを確認
      const email = user.email || "";
      if (email.endsWith("@ktc.ac.jp")) {
        return true;
      }
      return false;
    },
  },
  // セッション継続、Cookie などはデフォルトで有効
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
