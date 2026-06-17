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
        //ktc.ac.jp以外のメアドをブロック
        try {
          // 最終ログイン日時を更新
          const { createClient } = require("@supabase/supabase-js");
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SECRET_KEY!,
          );

          await supabase
            .schema("next_auth")
            .from("users")
            .update({ last_login: new Date().toISOString() })
            .eq("email", user.email);
        } catch (error) {
          console.error("Failed to update last_login:", error);
          // ログイン自体は成功させる
        }
        return true;
      }
      return false;
    },
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        (session.user as any).id = user.id;

        // Fetch fresh user data to ensure custom fields (language, commute_method) are up to date
        try {
          const { createClient } = require("@supabase/supabase-js");
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SECRET_KEY!,
          );

          const { data: userData } = await supabase
            .schema("next_auth")
            .from("users")
            .select("language, commute_method")
            .eq("id", user.id)
            .single();

          if (userData) {
            (session.user as any).language = userData.language || "ja_JP";
            (session.user as any).commute_method = userData.commute_method;
          } else {
            (session.user as any).language = (user as any).language || "ja_JP";
            (session.user as any).commute_method = (user as any).commute_method;
          }
        } catch (error) {
          console.error(
            "Failed to fetch fresh user data in session callback:",
            error,
          );
          (session.user as any).language = (user as any).language || "ja_JP";
          (session.user as any).commute_method = (user as any).commute_method;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};
