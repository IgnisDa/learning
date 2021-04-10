<template>
  <div class="flex justify-center">
    <div
      class="z-10 flex items-center p-2 mt-3 space-x-3 rounded-lg shadow-2xl dark:bg-fuchsia-600"
    >
      <ig-icon
        name="moon"
        class="w-6 h-6 cursor-pointer sm:h-8 sm:w-8 md:w-10 md:h-10"
        no-size
        no-color
      ></ig-icon>
      <div
        class="flex items-center h-4 p-1 bg-indigo-500 cursor-pointer w-7 dark:bg-indigo-700 sm:w-12 md:w-14 sm:h-6 md:h-8 rounded-3xl"
        @click="toggleColorMode()"
      >
        <div
          class="w-3 h-3 transition-transform duration-300 ease-in-out transform bg-gray-100 shadow-xl rounded-3xl sm:w-4 md:w-6 sm:h-4 md:h-6 ring-1 ring-red-300"
          :class="{
            'translate-x-full': $colorMode.preference === 'light',
          }"
        ></div>
      </div>
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
export default {
  components: {},
  data: () => ({
    clicked: true,
  }),
  computed: {},
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
