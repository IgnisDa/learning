<template>
  <transition name="mobile-navbar">
    <div
      v-show="isOpen"
      id="mobile-navbar"
      class="fixed inset-0 flex sm:hidden"
    >
      <div class="text-white bg-gray-900 m-auto w-5/6 h-5/6">
        <div
          class="uppercase font-bold flex flex-col justify-around h-full text-gray-50 text-sm"
        >
          <NuxtLink
            :to="{ name: 'index' }"
            class="ml-6 transition duration-300 text-blue-500 hover:text-blue-400"
          >
            Home
          </NuxtLink>
          <a
            href="#about"
            class="ml-6 transition duration-300 hover:text-blue-400"
          >
            About
          </a>
          <a
            href="#portfolio"
            class="ml-6 transition duration-300 hover:text-blue-400"
          >
            Portfolio
          </a>
          <a
            href="#services"
            class="ml-6 transition duration-300 hover:text-blue-400"
          >
            Services
          </a>
          <a
            href="#team"
            class="ml-6 transition duration-300 hover:text-blue-400"
          >
            Team
          </a>
          <a
            href="#blog"
            class="ml-6 transition duration-300 hover:text-blue-400"
          >
            Blog
          </a>
          <a
            href="#contact"
            class="ml-6 transition duration-300 hover:text-blue-400"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isOpen: (state) => state.navbar.isOpen,
    }),
  },
  mounted() {
    const section = document.querySelectorAll('.section')
    const sections = {}
    let i = 0

    Array.prototype.forEach.call(section, function (e) {
      sections[e.id] = e.offsetTop
    })

    window.onscroll = function () {
      const scrollPosition =
        document.documentElement.scrollTop || document.body.scrollTop

      for (i in sections) {
        if (sections[i] <= scrollPosition) {
          document
            .querySelector('#mobile-navbar .text-blue-500')
            .classList.remove('text-blue-500')
          document
            .querySelector('#mobile-navbar a[href*=' + i + ']')
            .classList.add('text-blue-500')
        }
      }
    }
  },
  methods: {
    ...mapMutations({
      toggleNavbar: 'navbar/toggleNavbar',
    }),
  },
}
</script>

<style scoped>
.mobile-navbar-enter-active {
  animation: slideIn 0.5s;
}
@keyframes slideIn {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.mobile-navbar-leave-active {
  animation: slideOut 0.5s;
}
@keyframes slideOut {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}
</style>
