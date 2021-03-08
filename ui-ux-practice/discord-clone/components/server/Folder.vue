<template>
  <div>
    <div
      class="col-start-1 row-end-2 bg-dark-but-not-black h-full w-12 mx-auto"
      style="border-radius: 85px 85px 100px 100px"
    ></div>
    <div class="space-y-2 flex flex-col items-center col-start-1 row-end-2">
      <div class="h-8 w-8 flex justify-center items-center my-2">
        <FontAwesomeIcon
          class="fill-current text-blue-400 p-1"
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
