<template>
  <div class="mt-10 md:mt-14">
    <div class="bg-transparent md:max-w-6xl mx-auto">
      <div class="flex justify-between items-center mx-6 md:mx-0">
        <NuxtLink :to="{ name: 'index' }">
          <div class="font-bold text-white text-3xl">Krunch</div>
        </NuxtLink>
        <div class="transition duration-300 hover:bg-gray-900 md:hidden p-2">
          <FontAwesomeIcon
            class="h-6 w-6 fill-current transition duration-200 ease-in text-white"
            :icon="['fas', 'bars']"
          />
        </div>
        <div class="uppercase font-bold text-gray-50 text-sm hidden sm:block">
          <NuxtLink
            :to="{ name: 'index' }"
            class="ml-10 transition duration-300 hover:text-blue-400"
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
</template>

<script>
export default {
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
            .querySelector('.text-blue-500')
            .classList.remove('text-blue-500')
          document
            .querySelector('a[href*=' + i + ']')
            .classList.add('text-blue-500')
        }
      }
    }
  },
}
</script>
