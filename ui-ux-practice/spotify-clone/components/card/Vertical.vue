<template>
  <div
    role="vertical-card"
    class="h-[290px] rounded shadow-2xl cursor-pointer bg-light-black bg-opacity-60 p-2"
    style="backdrop-filter: blur(50px)"
    @mouseover="hovered = true"
    @mouseout="hovered = false"
  >
    <div class="flex flex-col items-center justify-between w-full h-full">
      <div class="relative flex-none w-20 h-20 xl:h-44 xl:w-44">
        <img
          :src="audioDetails.imageUrl"
          :alt="audioDetails.name"
          class="object-cover w-full h-full"
        />
        <CardPlayIcon
          :hovered="hovered"
          class="absolute bottom-3 right-3"
        ></CardPlayIcon>
      </div>
      <div
        class="items-center flex-none flex-grow py-2 font-bold text-left text-white line-clamp-2"
      >
        {{ audioDetails.name }}
      </div>
      <div
        class="flex-none flex-grow text-sm font-bold text-left text-gray-400 line-clamp-1"
      >
        <span v-if="audioDetails.playlist">{{ audioDetails.playlist }}</span>
        <span v-else>Default name</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    audioDetails: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      hovered: false,
    }
  },
}
</script>
