<template>
  <div class="my-auto flex-grow flex justify-between flex-col">
    <div class="m-auto max-w-5xl">
      <div class="uppercase text-gray-100 text-6xl text-center m-5">
        Clean and flexible template
      </div>
      <div class="text-gray-50 text-center text-lg m-2 max-w-5xl">
        <div>
          Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc
          ut sem vitae risus tristique posuere.
        </div>
        <div>
          Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut
          commodo diam libero vitae erat.
        </div>
      </div>
      <div class="flex justify-center m-10">
        <button
          class="uppercase bg-blue-500 mx-3 p-3 text-gray-50 text-sm font-bold tracking-wide px-8 rounded-md hover:bg-gray-800 transition duration-200 ease-in"
        >
          Download Now
        </button>
        <button
          class="uppercase bg-transparent mx-3 p-3 text-gray-50 text-sm font-bold tracking-wide px-8 rounded-md hover:bg-blue-500 transition duration-200 ease-in border border-blue-500"
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
