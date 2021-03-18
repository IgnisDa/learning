<template>
  <div class="relative flex items-center w-full">
    <div
      v-if="unread || notifications"
      class="absolute w-2 h-2 duration-300 transform -translate-x-1 bg-white rounded-full transition-height"
      :class="{ 'h-5': hovered }"
    ></div>
    <div class="flex items-center justify-center flex-grow w-full">
      <div
        class="relative"
        @mouseover="handleMouseOver()"
        @mouseleave="handleMouseLeave()"
      >
        <img
          v-if="noImage !== true"
          class="w-12 h-12 duration-300 cursor-pointer hover:rounded-xl transition-border-radius rounded-[100px]"
          :src="`https://picsum.photos/seed/${getRandomString()}/300`"
          :alt="`${serverName}-icon`"
          loading="lazy"
        />
        <ServerInfoInitials
          v-else
          class="w-12 h-12 text-lg"
          :server-name="serverName"
        ></ServerInfoInitials>
        <!-- <div v-if="showTooltip" class="absolute inset-0 flex left-12">
          <div class="z-[9999] my-auto bg-red-400 border-8">Hello</div>
        </div> -->
        <div
          v-if="notifications !== 0"
          class="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-red-600 border-4 rounded-full cursor-pointer pointer-events-none border-almost-black"
        >
          {{ notifications }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRandomString } from '~/utils.js'

export default {
  props: {
    serverName: {
      type: String,
      required: true,
    },
    noImage: {
      type: Boolean,
      default: false,
    },
    notifications: {
      type: Number,
      default: 0,
    },
    unread: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    hovered: false,
    showTooltip: false,
  }),
  methods: {
    handleMouseOver() {
      this.hovered = true
      this.showTooltip = true
    },
    handleMouseLeave() {
      this.hovered = false
      this.showTooltip = false
    },
    getInitials(string) {
      const names = string.split(' ')
      let initials = names[0].substring(0, 1).toUpperCase()
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    },
    getRandomString() {
      return getRandomString()
    },
  },
}
</script>
