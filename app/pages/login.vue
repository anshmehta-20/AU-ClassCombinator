<script lang="ts" setup>
definePageMeta({
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: "/" },
});

const route = useRoute();
const router = useRouter();

const { data: semesters } = await useFetch<string[]>("/api/semesters", {
  default: () => ["Winter 2027"],
});
const latestSemester = computed(
  () => semesters.value?.[0] ?? "Winter 2027"
);

const errorMessage = computed(() => {
  if (route.query.error === "AccessDenied") {
    return "Access Denied: Only Ahmedabad University Google accounts (@ahduni.edu.in) are permitted to sign in.";
  }
  if (route.query.error) {
    return "Sign in failed. Please ensure you are using your @ahduni.edu.in account.";
  }
  return null;
});

onMounted(() => {
  // Clean up the URL if callbackUrl is just root
  if (route.query.callbackUrl) {
    const callbackUrl = route.query.callbackUrl as string;
    if (
      callbackUrl === "/" ||
      callbackUrl === window.location.origin ||
      callbackUrl === window.location.origin + "/"
    ) {
      const query = { ...route.query };
      delete query.callbackUrl;
      router.replace({ query });
    }
  }
});
</script>

<template>
  <div class="landing-page px-4">
    <div class="wrapper">
      <div class="flex flex-col gap-4 items-center">
        <Logo />
        <div class="text-base md:text-xl flex flex-col items-center text-center">
          <div><b>{{ latestSemester }}</b> Registration ahead?</div>
          <div class="text-muted">
            Class Combinator is here to help you out!
          </div>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="w-full max-w-md p-3.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-sm text-center font-medium"
      >
        {{ errorMessage }}
      </div>

      <LoginWithGoogle />

      <div
        class="text-xs text-muted text-center max-w-md bg-neutral-500/10 border border-neutral-500/20 rounded-lg p-3 space-y-1.5"
      >
        <p>
          This is an updated <b>fork</b> of the original
          <a
            href="https://github.com/JeelRajodiya/AU-ClassCombinator"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary underline hover:opacity-80 font-medium"
          >AU-ClassCombinator</a>
          project by
          <a
            href="https://github.com/JeelRajodiya"
            target="_blank"
            rel="noopener noreferrer"
            class="underline hover:opacity-80 font-medium"
          >Jeel Rajodiya</a>, created because the original project was not updated for Winter 2027.
        </p>
        <p class="text-[11px] text-muted/80">
          All credits for the original app architecture belong to Jeel Rajodiya.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100dvh - 4rem);
  width: 100%;
  flex-direction: column;
  padding-bottom: 4em;
}

@media (min-width: 768px) {
  .landing-page {
    padding-bottom: 10em;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  gap: 1.5rem;
}
</style>
