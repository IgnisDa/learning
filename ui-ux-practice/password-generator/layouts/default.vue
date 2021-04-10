<template>
  <div
    class="flex flex-col h-screen bg-yellow-400 dark:bg-cyan-900"
    :class="{ 'debug-screens': mode !== 'production' }"
  >
    <NavBar class="flex-none"></NavBar>
    <Nuxt class="flex-grow" />
  </div>
</template>

<script>
export default {
  data: () => ({
    mode: process.env.NODE_ENV,
  }),
}
</script>
