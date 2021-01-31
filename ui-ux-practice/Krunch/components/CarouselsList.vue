<template>
  <div class="carousel-view text-white">
    <div v-for="(testimonial, index) in allTestimonialsGetter" :key="index + 0">
      <CarouselItem
        :testimonial="testimonial"
        :active="index === currentIndex"
      />
    </div>
    <div class="carousel-controls flex justify-center mt-10 mb-10 sm:mb-0">
      <div v-for="(_testimonial, index) in allTestimonialsGetter" :key="index">
        <div
          class="h-4 w-4 rounded-full bg-gray-200 mx-1 cursor-pointer"
          :class="index !== currentIndex ? 'opacity-50' : ''"
          @click="changeTestimonialItem(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    currentIndex: 0,
  }),
  computed: {
    ...mapGetters({
      allTestimonialsGetter: 'testimonials/allTestimonialsGetter',
    }),
  },
  methods: {
    changeTestimonialItem(index) {
      this.currentIndex = index
    },
  },
}
</script>
