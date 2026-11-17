// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
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
});
