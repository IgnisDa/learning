<template>
  <div class="flex flex-col w-full space-y-2">
    <div
      v-for="(folderInfo, _, serverFolderIndex) in serverFolders"
      :key="`${serverFolderIndex}-folder`"
      class="grid w-full rounded-b-full rounded-t-2xl"
    >
      <div
        class="w-12 h-full col-start-1 row-end-2 mx-auto bg-dark-but-not-black rounded-[85px]"
      ></div>
      <div class="flex flex-col col-start-1 row-end-2 space-y-2">
        <transition
          name="toggle-folder"
          tag="div"
          class="flex flex-col space-y-2"
        >
          <div
            v-if="folderInfo.open"
            class="flex flex-col items-center space-y-2"
          >
            <div
              class="flex items-center justify-center w-8 h-8 my-2 cursor-pointer"
              @click="folderInfo.open = false"
            >
              <FontAwesomeIcon
                class="p-1 text-blue-400 fill-current"
                :icon="['fa', 'folder']"
              ></FontAwesomeIcon>
            </div>
            <div class="flex flex-col w-full space-y-2">
              <ServerInfo
                v-for="(server, folderIndex) in folderInfo.folders"
                :key="`${folderIndex}-folder-item`"
                :notifications="server.notifications"
                :server-name="server.name"
                :no-image="server.noImage"
                :unread="server.unread"
              >
              </ServerInfo>
            </div>
          </div>
          <ServerCollage
            v-else
            class="w-12 h-12 cursor-pointer"
            :servers="firstFourServers(folderInfo)"
            @click.native="folderInfo.open = true"
          ></ServerCollage>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    serverFolders: {
      type: Object,
      required: true,
    },
  },
  methods: {
    firstFourServers(folderInfo) {
      const servers = []
      for (const folder in folderInfo.folders) {
        if (parseInt(folder) === 4) break
        servers.push(folderInfo.folders[folder])
      }
      return servers
    },
  },
}
</script>

<style lang="scss" scoped>
.toggle-folder-leave-active,
.toggle-folder-enter-active {
  // transition-duration: 1s;
  transition-property: height;
}

.toggle-folder-leave-to {
  height: auto;
}
</style>
