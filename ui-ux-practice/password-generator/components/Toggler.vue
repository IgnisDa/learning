<template>
  <div
    class="relative flex items-center h-4 px-0.5 py-1 bg-indigo-500 cursor-pointer w-7 dark:bg-indigo-700 sm:w-12 md:w-14 sm:h-6 md:h-8 rounded-3xl"
  >
    <div
      class="absolute w-3 h-3 transition-all duration-300 ease-in-out transform bg-gray-100 shadow-xl toggler rounded-3xl sm:w-4 md:w-6 sm:h-4 md:h-6 ring-1 sm:ring-2 ring-blue-300"
      :class="[toggled ? 'left-3 sm:left-7' : 'left-1']"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    toggled: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
