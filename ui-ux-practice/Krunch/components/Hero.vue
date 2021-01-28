<template>
  <div id="hero-background">
    <div class="max-w-6xl mx-auto container pt-5 flex flex-col h-full">
      <HeroNavbar />
      <HeroText />
    </div>
  </div>
</template>

<style scoped>
#hero-background {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
    url('~assets/images/hero-bg.jpg');
  height: 770px;
  @apply bg-local bg-center bg-no-repeat;
}
</style>
