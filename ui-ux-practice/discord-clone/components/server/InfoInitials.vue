<template>
  <div
    class="flex items-center justify-center hover:bg-[#7289DA] transition-border-radius-and-color duration-300 cursor-pointer bg-not-quite-black rounded-[100px] hover:rounded-lg"
  >
    <span class="flex-none text-gray-300 uppercase">
      {{ getInitials(serverName) }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    serverName: {
      type: String,
      required: true,
    },
  },
  methods: {
    getInitials(string) {
      const names = string.split(' ')
      let initials = names[0].substring(0, 1).toUpperCase()
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      if (!initials) initials = 'Z'
      return initials
    },
  },
}
</script>
