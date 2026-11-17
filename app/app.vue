<script setup lang="ts">
const { status, signOut, data } = useAuth();
</script>

<template>
  <UApp>
    <div class="min-h-dvh flex flex-col justify-between">
      <main class="flex-1 flex flex-col min-w-0">
        <NuxtPage />
      </main>
      <footer class="w-full shrink-0 text-sm md:text-base text-default text-center py-4 px-4 space-y-1.5 border-t border-white/5">
        <div class="text-xs text-muted max-w-xl mx-auto leading-relaxed">
          This is an updated fork of the original
          <a
            href="https://github.com/JeelRajodiya/AU-ClassCombinator"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary underline hover:opacity-80 transition-opacity font-medium"
          >AU-ClassCombinator</a>
          by
          <a
            href="https://github.com/JeelRajodiya"
            target="_blank"
            rel="noopener noreferrer"
            class="underline hover:opacity-80 font-medium"
          >Jeel Rajodiya</a>, created because the original project was not updated for recent semesters. Full credits for the original app design and architecture belong to Jeel Rajodiya.
        </div>
        <div v-if="status === 'authenticated'" class="text-xs text-muted flex items-center justify-center gap-1.5 pt-0.5">
          <span>Signed in as {{ data?.user?.email }}</span>
          •
          <button
            @click="signOut({ callbackUrl: '/login' })"
            class="underline text-primary cursor-pointer hover:opacity-80"
          >
            Sign out
          </button>
        </div>
      </footer>
    </div>
  </UApp>
</template>

<style>
html,
body,
#__nuxt,
#__layout {
  height: 100%;
  margin: 0;
}
</style>
