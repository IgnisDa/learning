<template>
  <div
    id="server-bar"
    class="bg-almost-black h-screen overflow-auto flex flex-col space-y-2"
    style="width: 72px"
  >
    <div class="flex my-2 justify-center">
      <div class="flex p-2 bg-dark-but-not-black rounded-full">
        <FontAwesomeIcon
          class="h-8 w-8 fill-current text-gray-200"
          :icon="['fab', 'discord']"
        ></FontAwesomeIcon>
      </div>
    </div>
    <div class="flex justify-center items-center">
      <div class="h-0.5 flex-none bg-gray-800 w-3/6"></div>
    </div>
    <div class="flex justify-center flex-col space-y-2 items-center">
      <div
        v-for="(server, index) in servers"
        :key="index"
        class="w-full relative flex items-center justify-center"
      >
        <div
          class="w-2 h-2 rounded-full absolute left-0 -translate-x-1 transform bg-white"
        ></div>
        <div class="w-full flex justify-center items-center">
          <div class="relative">
            <img
              class="h-12 w-12 cursor-pointer rounded-full hover:rounded-xl hover:rounded-br-full transition-border-radius duration-1000"
              :src="require(`~/assets/server-icons/${server.icon}`)"
              :alt="`${server.name}-icon`"
            />
            <div
              v-if="server.notification"
              class="absolute bottom-0 right-0 flex justify-center items-center border-4 border-almost-black bg-red-600 text-white rounded-full font-semibold text-xs h-5 w-5"
            >
              {{ server.notification }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="(folders, _, serverFolderIndex) in serverFolders"
        :key="`${serverFolderIndex}-folder`"
        class="rounded-t-2xl rounded-b-full bg-dark-but-not-black space-y-2 flex flex-col items-center w-12 mx-auto"
      >
        <div class="h-8 w-8 flex justify-center items-center my-2">
          <FontAwesomeIcon
            class="fill-current text-blue-400 p-1"
            :icon="['fa', 'folder']"
          ></FontAwesomeIcon>
        </div>
        <div
          v-for="(server, folderIndex) in folders"
          :key="`${folderIndex}-folder-item`"
        >
          <div
            v-if="server.icon"
            class="rounded-full hover:rounded-xl overflow-hidden transition-border-radius duration-1000"
          >
            <img
              class="h-12 w-12 cursor-pointer"
              :src="require(`~/assets/server-icons/${server.icon}`)"
              :alt="`${server.name}-icon`"
            />
          </div>
          <div
            v-else
            class="rounded-full bg-not-quite-black h-12 w-12 flex justify-center items-center"
          >
            <span class="text-gray-300 text-xl">
              {{ getInitials(server.name) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div
        class="flex p-2 bg-gray-700 rounded-full hover:rounded-xl duration-1000 hover:bg-green-400 transition-border-radius-and-color text-green-500 hover:text-green-100"
      >
        <FontAwesomeIcon
          class="h-8 w-8 p-1 fill-current"
          :icon="['fa', 'plus']"
        ></FontAwesomeIcon>
      </div>
    </div>
    <div class="flex justify-center">
      <div
        class="flex p-2 bg-gray-700 rounded-full hover:rounded-xl duration-00 hover:bg-green-400 transition-border-radius-and-color text-green-500 hover:text-green-100"
      >
        <FontAwesomeIcon
          class="h-8 w-8 p-1 fill-current"
          :icon="['fa', 'compass']"
        ></FontAwesomeIcon>
      </div>
    </div>
    <div class="flex justify-center items-center">
      <div class="h-0.5 flex-none bg-gray-800 w-3/6"></div>
    </div>
    <div class="flex justify-center">
      <div
        class="flex p-2 bg-gray-700 rounded-full hover:rounded-xl duration-1000 hover:bg-green-400 transition-border-radius-and-color text-green-500 hover:text-green-100"
      >
        <FontAwesomeIcon
          class="h-8 w-8 fill-current"
          :icon="['fa', 'download']"
        ></FontAwesomeIcon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    servers: [
      { name: 'Nuxt.js', icon: 'nuxtjs.png' },
      { name: 'Tailwind CSS', icon: 'tailwindcss.png' },
      { name: 'Vue Land', icon: 'vue-land.png' },
      { name: 'Python', icon: 'python.png' },
      { name: 'The Coding Den', icon: 'coding-den.png', notification: 1 },
      { name: 'Django', icon: 'django.png' },
      { name: 'Unixporn', icon: 'unixporn.png' },
    ],
    serverFolders: {
      folderOne: [
        { name: 'CSI Core Team', icon: 'csi-core-team.png' },
        { name: "enigma's fam", icon: "enigma's-fam.png" },
        { name: 'Swarg Lok', icon: 'swarg-lok.png' },
        { name: "DiabLo's Server", icon: "diablo's-server.png" },
        { name: 'EB08', icon: 'eb08.png' },
        { name: 'SEAS BU 2024', icon: 'seas-bu.png' },
        { name: 'Bennett University', icon: 'bennett-university.png' },
        { name: 'CSS Sucks', icon: '' },
      ],
      folderTwo: [
        { name: 'CSI Core Team', icon: 'csi-core-team.png' },
        { name: "enigma's fam", icon: "enigma's-fam.png" },
        { name: 'Swarg Lok', icon: 'swarg-lok.png' },
        { name: "DiabLo's Server", icon: "diablo's-server.png" },
        { name: 'EB08', icon: 'eb08.png' },
        { name: 'SEAS BU 2024', icon: 'seas-bu.png' },
        { name: 'Bennett University', icon: 'bennett-university.png' },
        { name: 'CSS Sucks', icon: '' },
      ],
    },
  }),
  methods: {
    getInitials(string) {
      const names = string.split(' ')
      let initials = names[0].substring(0, 1).toUpperCase()
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    },
  },
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  background: transparent;
  width: 0;
}
</style>
