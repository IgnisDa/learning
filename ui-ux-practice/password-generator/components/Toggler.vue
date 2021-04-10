<template>
  <div
    class="flex items-center h-4 p-1 bg-indigo-500 cursor-pointer w-7 dark:bg-indigo-700 sm:w-12 md:w-14 sm:h-6 md:h-8 rounded-3xl"
  >
    <div
      class="w-3 h-3 transition-transform duration-300 ease-in-out transform bg-gray-100 shadow-xl rounded-3xl sm:w-4 md:w-6 sm:h-4 md:h-6 ring-1 ring-red-300"
      :class="{
        'translate-x-full': toggled,
      }"
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
