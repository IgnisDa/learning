<template>
  <div id="hero">
    <div class="mx-auto container flex flex-col h-full">
      <HeroNavbar />
      <HeroText />
    </div>
  </div>
</template>

<style scoped>
#hero {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
    url('~assets/images/hero-bg.jpg');
  height: 770px;
  @apply bg-local bg-center bg-no-repeat;
}
</style>
