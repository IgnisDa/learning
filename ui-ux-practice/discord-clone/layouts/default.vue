<template>
  <div
    :class="{ 'debug-screens': mode !== 'production' }"
    class="h-screen flex"
  >
    <ServerBar class="flex-none"></ServerBar>
    <ContentAndUser class="flex-grow"></ContentAndUser>
  </div>
</template>

<script>
export default {
  data: () => ({
    mode: process.env.NODE_ENV,
  }),
}
</script>
