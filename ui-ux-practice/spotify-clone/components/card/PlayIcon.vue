<template>
  <div
    class="flex items-center justify-center flex-none transition duration-200 transform"
    :class="!hovered ? 'opacity-0 translate-y-2' : '-translate-y-0'"
  >
    <div
      class="p-2 transition-transform transform rounded-full shadow-2xl bg-spotify-green hover:scale-105"
    >
      <ig-icon
        name="play"
        size="lg"
        class="text-white transform translate-x-0.5"
      ></ig-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hovered: {
      default: false,
      type: Boolean,
    },
  },
}
</script>
