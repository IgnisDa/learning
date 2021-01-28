<template>
  <div class="my-auto flex-grow flex justify-between flex-col">
    <div class="w-4/5 m-auto md:max-w-5xl">
      <div
        class="uppercase text-gray-100 text-4xl md:text-6xl text-center md:m-5 leading-relaxed"
      >
        Clean and flexible template
      </div>
      <div
        class="leading-loose tracking-tight md:tracking-normal text-gray-50 text-center text-sm md:text-lg md:m-2 md:max-w-5xl"
      >
        <div>
          Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc
          ut sem vitae risus tristique posuere.
        </div>
        <div>
          Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut
          commodo diam libero vitae erat.
        </div>
      </div>
      <div class="flex flex-col justify-center m-5 md:m-10 md:flex-row">
        <button
          class="uppercase bg-blue-500 mx-5 my-2 md:mx-3 p-3 text-gray-50 text-sm font-bold tracking-wide md:px-8 rounded-md hover:bg-gray-800 transition duration-200 ease-in"
        >
          Download Now
        </button>
        <button
          class="uppercase bg-transparent mx-5 my-2 md:mx-3 p-3 text-gray-50 text-sm font-bold tracking-wide md:px-8 rounded-md hover:bg-blue-500 transition duration-200 ease-in border border-blue-500"
        >
          View features
        </button>
      </div>
    </div>
    <div class="mx-auto mb-3">
      <a href="#about">
        <FontAwesomeIcon
          class="h-8 w-8 fill-current hover:text-blue-500 transition duration-200 ease-in text-white"
          :icon="['fas', 'chevron-down']"
        />
      </a>
    </div>
  </div>
</template>
