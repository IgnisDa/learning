<template>
  <div>
    <div
      class="w-12 h-full col-start-1 row-end-2 mx-auto bg-dark-but-not-black"
      style="border-radius: 85px 85px 100px 100px"
    ></div>
    <div class="flex flex-col items-center col-start-1 row-end-2 space-y-2">
      <div class="flex items-center justify-center w-8 h-8 my-2">
        <FontAwesomeIcon
          class="p-1 text-blue-400 fill-current"
          :icon="['fa', 'folder']"
        ></FontAwesomeIcon>
      </div>
      <div
        v-for="(server, folderIndex) in folders"
        :key="`${folderIndex}-folder-item`"
        class="w-full"
      >
        <ServerInfo
          :notifications="server.notifications"
          :server-name="server.name"
          :image="server.icon"
          :unread="server.unread"
        >
        </ServerInfo>
      </div>
    </div>
  </div>
</template>
