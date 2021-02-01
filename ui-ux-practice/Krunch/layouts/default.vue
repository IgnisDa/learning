<template>
  <div
    :class="mode !== 'production' ? 'debug-screens' : ''"
    class="antialiased"
  >
    <DynamicNavbar />
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
