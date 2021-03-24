<template>
  <div
    :class="{ 'debug-screens': mode !== 'production' }"
    class="flex h-screen"
  >
    <ServerBar class="flex-none"></ServerBar>
    <ChannelBar class="flex-none w-[240px] h-full"></ChannelBar>
    <div class="relative flex flex-col flex-grow">
      <InformationBar class="flex-none"></InformationBar>
      <Nuxt class="flex-grow bg-light-black" />
    </div>
    <UserBar class="flex-none w-[240px] h-full"></UserBar>
  </div>
</template>

<script>
export default {
  data: () => ({
    mode: process.env.NODE_ENV,
  }),
}
</script>
