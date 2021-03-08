<template>
  <div class="h-screen flex flex-col">
    <TopBar class="flex-none h-12"></TopBar>
    <div class="flex w-full flex-grow">
      <ChannelBar style="width: 240px" class="flex-none h-full"></ChannelBar>
      <Nuxt class="w-full h-full" />
      <UserBar style="min-width: 240px" class="h-full"></UserBar>
    </div>
  </div>
</template>
