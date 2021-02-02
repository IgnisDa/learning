<template>
  <div
    id="portfolio"
    class="mt-20 flex flex-col mx-auto justify-center items-center scroll-margin-top section"
  >
    <div class="mx-auto text-center md:max-w-7xl">
      <div class="uppercase my-1 font-semibold text-3xl text-gray-700">
        Portfolio
      </div>
      <div class="my-3 text-sm text-gray-700 italic md:text-lg">
        An eye for detail makes our work beautiful
      </div>
    </div>
    <div class="w-20 h-0.5 mx-auto my-4 bg-blue-400"></div>
    <div class="flex flex-wrap">
      <div v-for="index in 8" :key="index" class="w-full md:w-1/2 lg:w-1/4">
        <img
          :src="require(`~/assets/images/portfolio-${index}.jpg`)"
          :alt="`portfolio-${index}.jpg`"
          class="h-full w-full object-cover"
        />
      </div>
    </div>
    <div class="my-10">
      <div class="mx-auto text-lg text-center italic text-gray-600">
        Have a Project in Mind?
      </div>
      <div>
        <button
          class="mt-10 p-3 text-center mx-auto px-7 rounded-md uppercase border border-blue-400 hover:text-gray-200 font-semibold hover:bg-blue-400 transition duration-200 ease-in"
        >
          Contact Now
        </button>
      </div>
    </div>
  </div>
</template>
