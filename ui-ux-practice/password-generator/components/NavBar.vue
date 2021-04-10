<template>
  <div class="z-10 flex p-2 shadow-2xl bg-cyan-600 dark:bg-fuchsia-600">
    <ig-icon
      name="moon"
      class="w-6 h-6 cursor-pointer sm:h-8 sm:w-8 md:w-10 md:h-10 lg:w-14 lg:h-14"
      variant="black"
    ></ig-icon>
    <ig-icon
      name="sun"
      class="w-6 h-6 cursor-pointer sm:h-8 sm:w-8 md:w-10 md:h-10 lg:w-14 lg:h-14"
      variant="black"
    ></ig-icon>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    clicked: true,
  }),
  computed: {
    getColorModeIcon() {
      if (this.$colorMode.value === 'light') {
        return 'LightModeIcon'
      } else {
        return 'darkModeIcon'
      }
    },
  },
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
