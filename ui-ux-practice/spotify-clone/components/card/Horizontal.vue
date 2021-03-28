<template>
  <div
    role="horizontal-card"
    class="flex items-center space-x-4 overflow-hidden rounded shadow-2xl cursor-pointer bg-light-black bg-opacity-60"
    style="backdrop-filter: blur(50px)"
    @mouseover="handleHoverOver()"
    @mouseout="handleHoverOut()"
  >
    <div class="flex-none w-20 h-20">
      <img
        :src="audioDetails.imageUrl"
        :alt="audioDetails.name"
        class="object-cover w-full h-full"
      />
    </div>
    <div
      class="items-center flex-grow py-2 font-semibold text-white line-clamp-2"
    >
      {{ audioDetails.name }}
    </div>
    <CardPlayIcon class="w-20 h-20" :hovered="hovered"></CardPlayIcon>
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
