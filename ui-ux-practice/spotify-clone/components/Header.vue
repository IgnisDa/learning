<template>
  <div
    id="header"
    class="h-[60px] flex items-center justify-between absolute inset-x-0 px-6 z-[1]"
  >
    <div class="flex items-center space-x-4">
      <div
        class="p-1 transition-transform duration-200 transform bg-black rounded-full bg-opacity-70 hover:scale-110"
      >
        <ig-icon
          name="arrow-left"
          class="text-gray-200 cursor-pointer"
        ></ig-icon>
      </div>
      <div
        class="p-1 transition-transform duration-200 transform bg-black rounded-full bg-opacity-70 hover:scale-110"
      >
        <ig-icon
          name="arrow-right"
          class="text-gray-200 cursor-pointer"
        ></ig-icon>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <div
        class="px-5 py-2 text-sm font-semibold uppercase transition-transform duration-200 transform bg-black border border-gray-100 rounded-full cursor-pointer hover:scale-110 bg-opacity-80 text-gray-50"
      >
        Upgrade
      </div>
      <div
        class="flex items-center p-1 space-x-2 bg-black rounded-full bg-opacity-80 text-gray-50"
      >
        <div class="h-7 w-7">
          <img
            src="https://placedog.net/300/300?id=100"
            alt="user icon"
            class="object-contain w-full h-full rounded-full"
          />
        </div>
        <div class="text-xs font-bold tracking-wider">Dabreil Ignis</div>
        <div>
          <FontAwesomeIcon
            :icon="['fas', 'caret-down']"
            class="w-6 h-6 pr-1 text-gray-200 cursor-pointer"
          ></FontAwesomeIcon>
        </div>
      </div>
    </div>
  </div>
</template>
