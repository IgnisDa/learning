<template>
  <div v-if="active">
    <transition tag="div" name="fade">
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
    </transition>
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

<style scoped>
.fade-leave-active,
.fade-enter-active {
  transition: 1s;
  color: bisque;
}
.fade-enter {
  transform: translate(100%, 0);
}
.fade-leave-to {
  transform: translate(-100%, 0);
}
</style>
