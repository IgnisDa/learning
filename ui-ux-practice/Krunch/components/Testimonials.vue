<template>
  <div id="testimonials" class="mt-10 flex flex-col mx-auto my-auto">
    <div class="mt-10">
      <div
        class="mx-auto text-center md:max-w-7xl uppercase font-semibold text-3xl text-gray-100"
      >
        Testimonials
      </div>
      <div class="w-20 h-0.5 mx-auto my-4 bg-gray-50"></div>
    </div>
    <div class="mb-4 flex-grow flex flex-col justify-around">
      <div>
        <div
          class="text-center text-white md:max-w-5xl mx-auto w-2/3 leading-relaxed italic"
        >
          It really saves me time and effort. web design is exactly what our
          business has been lacking. Duis cursus, mi quis viverra ornare, eros
          dolor interdum nulla, ut commodo diam libero vitae erat. Aenean
          faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem
          risus tristique posuere.
        </div>
        <div class="uppercase font-semibold text-blue-600 mx-auto text-center">
          Walter Ward
        </div>
      </div>
      <div class="flex justify-center mt-16">
        <div class="h-4 w-4 rounded-full bg-gray-200 mx-1"></div>
        <div class="h-4 w-4 rounded-full bg-gray-300 mx-1 opacity-60"></div>
        <div class="h-4 w-4 rounded-full bg-gray-300 mx-1 opacity-60"></div>
      </div>
    </div>
  </div>
</template>

<style>
#testimonials {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('~assets/images/testimonials-bg.jpg');
  min-height: 450px;
  @apply bg-center bg-cover;
}
</style>
