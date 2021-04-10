<template>
  <div
    class="h-screen bg-yellow-400 dark:bg-cyan-900"
    :class="{ 'debug-screens': mode !== 'production' }"
  >
    <NavBar></NavBar>
    <Nuxt />
  </div>
</template>

<script>
export default {
  data: () => ({
    mode: process.env.NODE_ENV,
  }),
}
</script>
