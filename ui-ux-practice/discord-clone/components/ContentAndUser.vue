<template>
  <div class="h-screen flex flex-col">
    <TopBar class="bg-green-300 flex-none"></TopBar>
    <div class="flex w-full flex-grow">
      <ChannelBar class="flex-none h-full"></ChannelBar>
      <Nuxt class="w-full h-full" />
      <UserBar class="h-full"></UserBar>
    </div>
  </div>
</template>
