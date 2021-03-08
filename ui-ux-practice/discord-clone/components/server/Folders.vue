<template>
  <div class="w-full">
    <div
      v-for="(folderInfo, _, serverFolderIndex) in serverFolders"
      :key="`${serverFolderIndex}-folder`"
      class="rounded-t-2xl rounded-b-full w-full grid"
    >
      <div
        class="col-start-1 row-end-2 bg-dark-but-not-black h-full w-12 mx-auto"
        style="border-radius: 85px 85px 100px 100px"
      ></div>
      <div class="col-start-1 row-end-2">
        <transition name="toggle-folder" tag="div">
          <div
            v-if="folderInfo.open"
            class="space-y-2 flex flex-col items-center"
          >
            <div
              class="h-8 w-8 flex justify-center items-center my-2 cursor-pointer"
              @click="folderInfo.open = false"
            >
              <FontAwesomeIcon
                class="fill-current text-blue-400 p-1"
                :icon="['fa', 'folder']"
              ></FontAwesomeIcon>
            </div>
            <div class="w-full flex-col flex space-y-2">
              <ServerInfo
                v-for="(server, folderIndex) in folderInfo.folders"
                :key="`${folderIndex}-folder-item`"
                :notifications="server.notifications"
                :server-name="server.name"
                :image="server.icon"
                :unread="server.unread"
              >
              </ServerInfo>
            </div>
          </div>
          <ServerCollage
            v-else
            class="w-12 h-12 cursor-pointer"
            :images="firstFourImages(folderInfo)"
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
    firstFourImages(folderInfo) {
      const images = []
      for (const folder in folderInfo.folders) {
        if (parseInt(folder) === 4) break
        images.push(folderInfo.folders[folder].icon)
      }
      return images
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
