<template>
  <transition name="navbar">
    <div
      v-show="showNavbar"
      id="navbar"
      class="bg-black py-2 md:py-6 md:px-10 bg-opacity-80 w-full fixed z-50"
    >
      <div class="md:max-w-6xl mx-auto">
        <div class="flex justify-between items-center mx-6 md:mx-0">
          <NuxtLink :to="{ name: 'index' }">
            <div class="font-bold text-white text-3xl">Krunch</div>
          </NuxtLink>
          <div
            class="transition duration-300 hover:bg-gray-900 md:hidden p-2"
            @click="toggleNavbar"
          >
            <FontAwesomeIcon
              class="fill-current transition duration-200 flex ease-in text-white"
              :icon="['fas', 'bars']"
              size="lg"
            ></FontAwesomeIcon>
          </div>
          <div class="uppercase font-bold text-gray-50 text-sm hidden sm:block">
            <NuxtLink
              :to="{ name: 'index' }"
              class="ml-10 transition duration-300 text-blue-500 hover:text-blue-400"
            >
              Home
            </NuxtLink>
            <a
              href="#about"
              class="ml-10 transition duration-300 hover:text-blue-400"
            >
              About
            </a>
            <a
              href="#portfolio"
              class="ml-10 transition duration-300 hover:text-blue-400"
            >
              Portfolio
            </a>
            <a
              href="#services"
              class="ml-10 transition duration-300 hover:text-blue-400"
            >
              Services
            </a>
            <a
              href="#team"
              class="ml-10 transition duration-300 hover:text-blue-400"
            >
              Team
            </a>
            <a
              href="#blog"
              class="ml-10 transition duration-300 hover:text-blue-400"
            >
              Blog
            </a>
            <a
              href="#contact"
              class="ml-10 transition duration-300 hover:text-blue-400"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  data: () => ({
    showNavbar: false,
  }),
  computed: {
    ...mapState({
      isOpen: (state) => state.navbar.isOpen,
    }),
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    ...mapMutations({
      toggleNavbar: 'navbar/toggleNavbar',
    }),
    onScroll() {
      const heroOffsetHeight = document.getElementById('hero').offsetHeight
      const currentScrollPos = window.pageYOffset
      if (currentScrollPos > heroOffsetHeight) {
        this.showNavbar = true
      } else {
        this.showNavbar = false
      }
    },
  },
}
</script>

<style scoped>
.navbar-enter,
.navbar-leave-to {
  visibility: hidden;
  height: 0;
  margin: 0;
  padding: 0;
  opacity: 0;
}

.navbar-enter-active,
.navbar-leave-active {
  transition: all 0.2s;
}
</style>
