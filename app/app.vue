<script setup lang="ts">
const { status, signOut, data } = useAuth();
</script>

<template>
  <UApp>
    <NuxtPage />
    <footer class="text-sm md:text-base text-default text-center py-4 px-4 space-y-1">
      <div>
        Give a star on
        <a
          href="https://github.com/JeelRajodiya/AU-ClassCombinator"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary underline hover:opacity-80 transition-opacity"
        >
          Github
        </a>
      </div>
      <div class="text-xs text-muted">
        Created by
        <a
          href="https://github.com/JeelRajodiya"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:opacity-80"
        >Jeel Rajodiya</a>
        • Winter 2027 data by
        <a
          href="https://github.com/anshmehta-20"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:opacity-80"
        >Ansh Mehta</a>
      </div>
      <div v-if="status === 'authenticated'" class="text-xs text-muted pt-1">
        Signed in as {{ data?.user?.email }} •
        <button
          @click="signOut({ callbackUrl: '/login' })"
          class="underline text-primary cursor-pointer hover:opacity-80"
        >
          Sign out
        </button>
      </div>
    </footer>
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
