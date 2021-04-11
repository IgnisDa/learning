<template>
  <div
    class="flex flex-col h-screen bg-blue-400 dark:bg-blue-900"
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
