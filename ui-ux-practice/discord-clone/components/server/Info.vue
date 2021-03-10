<template>
  <div class="relative flex items-center w-full">
    <div
      v-if="unread || notifications"
      class="absolute w-2 h-2 transform -translate-x-1 bg-white rounded-full"
    ></div>
    <div class="flex items-center justify-center flex-grow w-full">
      <div class="relative">
        <img
          v-if="image !== ''"
          class="w-12 h-12 duration-1000 rounded-full cursor-pointer hover:rounded-xl transition-border-radius"
          :src="require(`~/assets/server-icons/${image}`)"
          :alt="`${serverName}-icon`"
        />
        <ServerInfoInitials
          v-else
          class="w-12 h-12 text-lg"
          :server-name="serverName"
        ></ServerInfoInitials>
        <div
          v-if="notifications !== 0"
          class="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-red-600 border-4 rounded-full cursor-pointer border-almost-black"
        >
          {{ notifications }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    serverName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
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