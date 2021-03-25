<template>
  <div
    :class="{ 'debug-screens': mode !== 'production' }"
    class="flex flex-col h-screen"
  >
    <div class="flex flex-grow">
      <SideBar class="flex-none"></SideBar>
      <div class="relative flex flex-col w-full">
        <BackgroundColorOverlay></BackgroundColorOverlay>
        <Header class="flex-none"></Header>
        <Nuxt class="flex-grow" />
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
