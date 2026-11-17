// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@sidebase/nuxt-auth"],
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "AU Class Combinator - Winter 2027",
      meta: [
        {
          name: "description",
          content:
            "AU Class Combinator - Find the perfect class schedule at Ahmedabad University without clashes. Select your preferred courses for Winter 2027 and let Class Combinator generate conflict-free timetable combinations.",
        },
        {
          name: "keywords",
          content:
            "Ahmedabad University, AU, Class Combinator, Course Scheduler, Timetable Generator, Auris Directory, Course Combinations, Class Schedule Planner, AU Class Combinator, ClassCombinator, Winter 2027",
        },
      ],
    },
  },
  runtimeConfig: {
    // Private keys - only available on the server side
    authSecret: process.env.NUXT_AUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

    // Public keys - exposed to the client side
    public: {
      authOrigin: process.env.AUTH_ORIGIN,
    },
  },
  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    originEnvKey: "AUTH_ORIGIN",
    provider: {
      type: "authjs",
      trustHost: false,
    },
    globalAppMiddleware: true,
  },
});
