<template>
  <div class="flex justify-center">
    <div
      class="z-10 flex items-center p-2 mt-3 space-x-3 border border-black rounded-lg shadow-2xl dark:bg-fuchsia-600"
    >
      <ig-icon
        name="moon"
        class="w-6 h-6 cursor-pointer sm:h-8 sm:w-8 md:w-10 md:h-10"
        no-size
        no-color
      ></ig-icon>
      <toggler
        :toggled="$colorMode.preference === 'light'"
        @click.native="toggleColorMode()"
      ></toggler>
      <ig-icon
        name="sun"
        class="w-6 h-6 cursor-pointer sm:h-8 sm:w-8 md:w-10 md:h-10"
        no-size
        no-color
      ></ig-icon>
    </div>
  </div>
</template>

<script>
import Toggler from './Toggler.vue'

export default {
  components: { Toggler },
  methods: {
    toggleColorMode() {
      if (this.$colorMode.value === 'light') {
        this.$colorMode.preference = 'dark'
      } else {
        this.$colorMode.preference = 'light'
      }
    },
  },
}
</script>
