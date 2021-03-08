<template>
  <div class="flex w-full items-center relative">
    <div
      v-if="unread || notifications"
      class="w-2 h-2 absolute rounded-full -translate-x-1 transform bg-white"
    ></div>
    <div class="w-full flex justify-center items-center flex-grow">
      <div class="relative">
        <img
          v-if="image !== ''"
          class="h-12 w-12 cursor-pointer rounded-full hover:rounded-xl transition-border-radius duration-1000"
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
          class="absolute bottom-0 right-0 flex justify-center items-center border-4 border-almost-black bg-red-600 text-white rounded-full font-semibold text-xs h-6 w-6 cursor-pointer"
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
