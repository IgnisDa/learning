<template>
  <div
    class="absolute inset-x-0 z-10 flex items-center justify-center flex-grow h-12 border-b border-black bg-light-black border-opacity-70"
  >
    <div class="flex items-center mx-3 space-x-2">
      <FontAwesomeIcon
        class="w-5 h-5 text-gray-500 fill-current"
        :icon="['fas', 'hashtag']"
      ></FontAwesomeIcon>
      <div class="font-bold text-gray-50">help</div>
    </div>
    <div
      class="flex-grow pl-4 mx-2 text-sm tracking-tighter text-gray-300 border-l border-gray-600"
    >
      Help with Tailwind CSS and build process integration.
    </div>
    <div class="flex items-center mx-3 space-x-5">
      <FontAwesomeIcon
        class="w-5 h-5 text-gray-400 cursor-pointer fill-current hover:text-gray-200"
        :icon="['fas', 'bell']"
      ></FontAwesomeIcon>
      <FontAwesomeIcon
        class="w-5 h-5 text-gray-200 transform rotate-45 cursor-pointer fill-current hover:text-gray-200"
        :icon="['fas', 'thumbtack']"
      ></FontAwesomeIcon>
      <FontAwesomeIcon
        class="w-5 h-5 text-gray-400 cursor-pointer fill-current hover:text-gray-200"
        :icon="['fas', 'users']"
      ></FontAwesomeIcon>
    </div>
  </div>
</template>
