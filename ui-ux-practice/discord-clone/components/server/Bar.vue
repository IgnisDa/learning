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
      <div v-for="(server, index) in servers" :key="index" class="w-full">
        <ServerInfo
          :notifications="server.notifications"
          :server-name="server.name"
          :image="server.icon"
          :unread="server.unread"
        >
        </ServerInfo>
      </div>
      <ServerFolders :server-folders="serverFolders"></ServerFolders>
    </div>
    <div class="flex justify-center">
      <div
        class="flex p-2 bg-gray-700 rounded-full hover:rounded-xl hover:bg-green-500 transition-border-radius-and-color text-green-500 hover:text-green-100 cursor-pointer"
      >
        <FontAwesomeIcon
          class="h-8 w-8 p-1 fill-current"
          :icon="['fa', 'plus']"
        ></FontAwesomeIcon>
      </div>
    </div>
    <div class="flex justify-center">
      <div
        class="flex p-2 bg-gray-700 rounded-full hover:rounded-xl hover:bg-green-500 transition-border-radius-and-color text-green-500 hover:text-green-100 cursor-pointer"
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
        class="flex p-2 bg-gray-700 rounded-full hover:rounded-xl hover:bg-green-500 transition-border-radius-and-color text-green-500 hover:text-green-100 cursor-pointer"
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
      { name: 'Nuxt.js', icon: 'nuxtjs.png', unread: true },
      { name: 'Tailwind CSS', icon: 'tailwindcss.png' },
      { name: 'Vue Land', icon: 'vue-land.png' },
      { name: 'Python', icon: 'python.png', unread: true },
      {
        name: 'The Coding Den',
        icon: 'coding-den.png',
        notifications: 1,
      },
      { name: 'Django', icon: 'django.png', notifications: 2 },
      { name: 'Unixporn', icon: 'unixporn.png' },
    ],
    serverFolders: {
      folderOne: {
        open: true,
        folders: [
          { name: 'CSI Core Team', icon: 'csi-core-team.png', unread: true },
          { name: "enigma's fam", icon: "enigma's-fam.png" },
          { name: 'Swarg Lok', icon: 'swarg-lok.png' },
          { name: "DiabLo's Server", icon: "diablo's-server.png" },
          { name: 'EB08', icon: 'eb08.png' },
          {
            name: 'SEAS BU 2024',
            icon: 'seas-bu.png',
            unread: true,
            notifications: 10,
          },
          { name: 'Bennett University', icon: 'bennett-university.png' },
          { name: 'CSS Sucks', icon: '' },
        ],
      },
      folderTwo: {
        open: false,
        folders: [
          { name: 'Nuxt.js', icon: 'nuxtjs.png', unread: true },
          { name: 'Tailwind CSS', icon: 'tailwindcss.png' },
          { name: 'Vue Land', icon: 'vue-land.png' },
          { name: 'Python', icon: 'python.png', unread: true },
          {
            name: 'The Coding Den',
            icon: 'coding-den.png',
            notifications: 1,
          },
          { name: 'CSI Core Team', icon: 'csi-core-team.png', unread: true },
          { name: "enigma's fam", icon: "enigma's-fam.png" },
          { name: 'Swarg Lok', icon: 'swarg-lok.png' },
          { name: "DiabLo's Server", icon: "diablo's-server.png" },
          { name: 'EB08', icon: 'eb08.png' },
          { name: 'SEAS BU 2024', icon: 'seas-bu.png', unread: true },
          { name: 'Bennett University', icon: 'bennett-university.png' },
          { name: 'CSS Sucks', icon: '' },
        ],
      },
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
