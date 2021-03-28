<template>
  <div
    role="vertical-card"
    class="rounded shadow-2xl cursor-pointer bg-light-black bg-opacity-30 px-2 py-3 h-[290px] sm:h-[318px] md:h-[314px] lg:h-[305px] 2xl:h-[260px]"
    style="backdrop-filter: blur(50px)"
    @mouseover="handleHoverOver()"
    @mouseout="handleHoverOut()"
  >
    <div class="flex flex-col items-center justify-between w-full h-full">
      <div
        class="relative flex-none w-20 h-20 md:h-28 md:w-28 xl:h-36 xl:w-36 2xl:h-40 2xl:w-40"
      >
        <img
          :src="audioDetails.imageUrl"
          :alt="audioDetails.name"
          height="auto"
          width="auto"
          loading="lazy"
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
import { mapMutations } from 'vuex'
export default {
  props: {
    audioDetails: {
      required: true,
      type: Object,
    },
  },
  data: () => ({
    hovered: false,
  }),
  methods: {
    handleHoverOver() {
      this.hovered = true
      this.randomBackgroundColorMutation()
    },
    handleHoverOut() {
      this.hovered = false
      this.resetBackgroundColorMutation()
    },
    ...mapMutations({
      randomBackgroundColorMutation: 'background/randomBackgroundColor',
      resetBackgroundColorMutation: 'background/resetBackgroundColor',
    }),
  },
}
</script>
