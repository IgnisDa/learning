<template>
  <div
    class="flex items-center justify-between px-2 py-1 mx-auto space-x-3 rounded-md bg-not-quite-black h-11"
  >
    <FontAwesomeIcon
      class="flex-none w-6 h-6 text-gray-300 cursor-pointer fill-current hover:text-gray-200"
      :icon="['fas', 'plus']"
    ></FontAwesomeIcon>
    <input
      type="text"
      placeholder="Message #help"
      class="flex-grow text-sm font-light tracking-tight text-gray-500 bg-transparent focus:text-gray-100 focus:outline-none"
    />
    <div class="flex items-center space-x-3">
      <FontAwesomeIcon
        class="flex-none w-6 h-6 text-gray-300 cursor-pointer fill-current hover:text-gray-200"
        :icon="['fas', 'gift']"
      ></FontAwesomeIcon>
      <FontAwesomeIcon
        class="flex-none w-6 h-6 text-gray-300 cursor-pointer fill-current hover:text-gray-200"
        :icon="['fas', 'image']"
      ></FontAwesomeIcon>
      <FontAwesomeIcon
        class="flex-none w-6 h-6 text-gray-300 cursor-pointer fill-current hover:text-gray-200"
        :icon="['fas', 'sad-cry']"
      ></FontAwesomeIcon>
    </div>
  </div>
</template>
