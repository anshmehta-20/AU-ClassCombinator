import GoogleProvider from "next-auth/providers/google";
import { NuxtAuthHandler } from "#auth";

const config = useRuntimeConfig();

const authSecret =
  config.authSecret ||
  process.env.NUXT_AUTH_SECRET ||
  "development-secret-key-32-chars-long-min";
const googleClientId =
  config.googleClientId || process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret =
  config.googleClientSecret || process.env.GOOGLE_CLIENT_SECRET || "";

export default NuxtAuthHandler({
  secret: authSecret,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // @ts-expect-error Use .default or direct call depending on ESM/CJS interop
    (GoogleProvider.default || GoogleProvider)({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: "select_account",
          hd: "ahduni.edu.in",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const email = (
        user?.email ||
        (profile as { email?: string })?.email ||
        ""
      )
        .trim()
        .toLowerCase();

      // Strictly restrict login to Ahmedabad University accounts (@ahduni.edu.in)
      const domain = email.substring(email.lastIndexOf("@") + 1);
      if (domain === "ahduni.edu.in") {
        return true;
      }
      return false;
    },
    async session({ session }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
});
