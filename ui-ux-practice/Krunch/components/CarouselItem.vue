<template>
  <div v-if="active">
    <div class="flex-grow flex flex-col justify-around">
      <div class="mt-6">
        <div
          class="text-center text-white sm:w-1/2 sm:text-lg mx-auto w-2/3 leading-relaxed italic"
        >
          {{ testimonial.text }}
        </div>
        <div
          class="mt-5 uppercase font-semibold text-blue-500 mx-auto text-center"
        >
          {{ testimonial.author }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    testimonial: {
      type: Object,
      default: () => {
        return {}
      },
    },
    active: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
}
</script>
