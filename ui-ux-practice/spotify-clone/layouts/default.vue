<template>
  <div
    :class="{ 'debug-screens': mode !== 'production' }"
    class="flex flex-col h-screen"
  >
    <div class="flex flex-grow">
      <SideBar class="flex-none"></SideBar>
      <div class="relative flex flex-col flex-grow w-full">
        <BackgroundColorOverlay></BackgroundColorOverlay>
        <Header class="flex-none"></Header>
        <Nuxt class="flex-grow h-0 mt-20 main" />
      </div>
    </div>
    <div class="flex-none">
      <ControlBar></ControlBar>
      <ListeningOnBar></ListeningOnBar>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    mode: process.env.NODE_ENV,
  }),
}
</script>

<style lang="scss" scoped>
.main::-webkit-scrollbar {
  @apply bg-opacity-0 w-3;
}

.main::-webkit-scrollbar-thumb {
  @apply bg-gray-500 hover:bg-gray-400 transition-colors duration-200;
}
</style>
