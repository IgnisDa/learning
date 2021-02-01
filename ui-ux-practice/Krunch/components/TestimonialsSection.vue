<template>
  <div
    id="testimonials"
    class="mt-10 flex flex-col justify-center mx-auto my-auto scroll-margin-top"
  >
    <div>
      <div
        class="mx-auto text-center md:max-w-7xl uppercase font-semibold text-3xl text-gray-100 mt-10 sm:mt-0"
      >
        Testimonials
      </div>
      <div class="w-20 h-0.5 mx-auto my-4 bg-gray-50"></div>
    </div>
    <CarouselsList></CarouselsList>
  </div>
</template>

<script>
export default {
  components: {},
}
</script>

<style>
#testimonials {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('~assets/images/testimonials-bg.jpg');
  min-height: 450px;
  @apply bg-center bg-cover;
}
</style>
