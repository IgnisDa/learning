<template>
  <div class="mt-10 md:mt-14">
    <div class="bg-transparent md:max-w-6xl mx-auto">
      <div class="flex justify-between items-center mx-6 md:mx-0">
        <div class="font-bold text-white text-3xl">Krunch</div>
        <div class="transition duration-300 hover:bg-gray-900 md:hidden p-2">
          <FontAwesomeIcon
            class="h-6 w-6 fill-current transition duration-200 ease-in text-white"
            :icon="['fas', 'bars']"
          />
        </div>
        <div class="uppercase font-bold text-gray-50 text-sm hidden sm:block">
          <a
            href="#"
            class="ml-10 transition duration-300 text-blue-500 hover:text-blue-400"
          >
            Home
          </a>
          <a href="#" class="ml-10 transition duration-300 hover:text-blue-400">
            About
          </a>
          <a href="#" class="ml-10 transition duration-300 hover:text-blue-400">
            Portfolio
          </a>
          <a href="#" class="ml-10 transition duration-300 hover:text-blue-400">
            Services
          </a>
          <a href="#" class="ml-10 transition duration-300 hover:text-blue-400">
            Team
          </a>
          <a href="#" class="ml-10 transition duration-300 hover:text-blue-400">
            Blog
          </a>
          <a href="#" class="ml-10 transition duration-300 hover:text-blue-400">
            Contact
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
