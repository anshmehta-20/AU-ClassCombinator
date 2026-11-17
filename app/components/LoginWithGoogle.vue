<script setup lang="ts">
const { signIn, signOut, status } = useAuth();

const handleLogin = async () => {
  await signIn("google", { callbackUrl: "/", redirect: true });
};

const handleLogout = async () => {
  await signOut({ callbackUrl: "/login", redirect: true });
};
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <UButton
      size="lg"
      @click="handleLogin"
      class="max-w-fit font-black text-md px-5 py-2.5 cursor-pointer"
      v-if="status !== 'authenticated'"
      trailing-icon="i-streamline-logos:google-logo-solid"
    >
      Sign in with Google
    </UButton>
    <UButton size="sm" @click="handleLogout" class="max-w-fit font-black cursor-pointer" v-else>
      Logout
    </UButton>
    <p v-if="status !== 'authenticated'" class="text-xs text-muted">
      Only <b>@ahduni.edu.in</b> accounts are permitted
    </p>
  </div>
</template>
