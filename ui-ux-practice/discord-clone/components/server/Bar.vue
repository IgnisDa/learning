<template>
  <div
    id="server-bar"
    class="flex flex-col h-screen space-y-2 overflow-auto bg-almost-black"
    style="width: 72px"
  >
    <div class="flex justify-center my-2">
      <div class="flex p-2 rounded-full bg-dark-but-not-black">
        <FontAwesomeIcon
          class="w-8 h-8 text-gray-200 fill-current"
          :icon="['fab', 'discord']"
        ></FontAwesomeIcon>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <div class="h-0.5 flex-none bg-gray-800 w-3/6"></div>
    </div>
    <div class="flex flex-col items-center justify-center space-y-2">
      <div v-for="(server, index) in servers" :key="index" class="w-full">
        <ServerInfo
          :notifications="server.notifications"
          :server-name="server.name"
          :unread="server.unread"
          :no-image="server.noImage"
        >
        </ServerInfo>
      </div>
      <ServerFolders :server-folders="serverFolders"></ServerFolders>
    </div>
    <div class="flex justify-center">
      <div
        class="flex p-2 text-green-500 bg-gray-700 rounded-full cursor-pointer hover:rounded-xl hover:bg-green-500 transition-border-radius-and-color hover:text-green-100"
      >
        <FontAwesomeIcon
          class="w-8 h-8 p-1 fill-current"
          :icon="['fa', 'plus']"
        ></FontAwesomeIcon>
      </div>
    </div>
    <div class="flex justify-center">
      <div
        class="flex p-2 text-green-500 bg-gray-700 rounded-full cursor-pointer hover:rounded-xl hover:bg-green-500 transition-border-radius-and-color hover:text-green-100"
      >
        <FontAwesomeIcon
          class="w-8 h-8 p-1 fill-current"
          :icon="['fa', 'compass']"
        ></FontAwesomeIcon>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <div class="h-0.5 flex-none bg-gray-800 w-3/6"></div>
    </div>
    <div class="flex justify-center">
      <div
        class="flex p-2 text-green-500 bg-gray-700 rounded-full cursor-pointer hover:rounded-xl hover:bg-green-500 transition-border-radius-and-color hover:text-green-100"
      >
        <FontAwesomeIcon
          class="w-8 h-8 fill-current"
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
      { name: 'Nuxt.js', unread: true },
      { name: 'Tailwind CSS' },
      { name: 'Vue Land' },
      { name: 'Python', unread: true },
      { name: 'The Coding Den', notifications: 1 },
      { name: 'Django', notifications: 2 },
      { name: 'Unixporn', noImage: true },
    ],
    serverFolders: {
      folderOne: {
        open: true,
        folders: [
          { name: 'CSI Core Team', unread: true },
          { name: "enigma's fam" },
          { name: 'Swarg Lok' },
          { name: "DiabLo's Server", noImage: true },
          { name: 'EB08' },
          { name: 'SEAS BU 2024', unread: true, notifications: 10 },
          { name: 'Bennett University' },
          { name: 'CSS Sucks', noImage: true },
        ],
      },
      folderTwo: {
        open: false,
        folders: [
          { name: 'Nuxt.js', unread: true, noImage: true },
          { name: 'Tailwind CSS' },
          { name: 'Vue Land' },
          { name: 'Python', unread: true },
          { name: 'The Coding Den', notifications: 1 },
          { name: 'CSI Core Team', unread: true },
          { name: "enigma's fam" },
          { name: 'Swarg Lok', noImage: true },
          { name: "DiabLo's Server" },
          { name: 'EB08', noImage: true },
          { name: 'SEAS BU 2024', unread: true },
          { name: 'Bennett University' },
          { name: 'CSS Sucks' },
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
