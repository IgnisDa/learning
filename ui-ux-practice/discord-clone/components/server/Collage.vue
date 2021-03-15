<template>
  <div class="grid grid-cols-2 grid-rows-2 p-1 mx-auto">
    <div
      v-for="(server, index) in servers"
      :key="index"
      class="flex items-center justify-center"
    >
      <img
        v-if="server.noImage !== true"
        :src="`https://picsum.photos/seed/${getRandomString()}/300`"
        class="rounded-full p-0.5"
        :alt="`${server.name}-icon`"
        loading="lazy"
      />
      <ServerInfoInitials
        v-else
        class="p-0.5"
        style="font-size: 10px"
        :server-name="server.name"
      ></ServerInfoInitials>
    </div>
  </div>
</template>

<script>
import { getRandomString } from '~/utils.js'

export default {
  props: {
    servers: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getRandomString() {
      return getRandomString()
    },
  },
}
</script>
