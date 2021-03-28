<template>
  <div
    id="background-color-overlay"
    class="inset-0 z-[-1] absolute transition-colors duration-1000"
    :class="getBackgroundColor"
  ></div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      backgroundColorState: (state) => state.background.backgroundColor,
    }),
    getBackgroundColor() {
      switch (this.backgroundColorState) {
        case 'red':
          return 'bg-red-900'
        case 'green':
          return 'bg-green-900'
        case 'blue':
          return 'bg-gray-900'
        default:
          return 'bg-light-black'
      }
    },
  },
}
</script>
