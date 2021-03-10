<template>
  <div id="channel-bar" class="flex flex-col bg-dark-but-not-black">
    <div class="flex-grow px-3 py-2">
      <div
        class="flex items-center px-2 py-2 space-x-4 tracking-tight text-gray-300 rounded-md hover:bg-light-black"
      >
        <FontAwesomeIcon
          class="w-6 h-6 fill-current text-gray-50"
          :icon="['fas', 'user-friends']"
        ></FontAwesomeIcon>
        <div class="flex items-center justify-between flex-grow">
          <div>Friends</div>
          <div
            class="flex items-center justify-center w-4 h-4 text-sm font-bold bg-red-600 rounded-full"
          >
            1
          </div>
        </div>
      </div>
      <div
        class="flex items-center px-2 py-2 space-x-5 tracking-tight text-gray-300 rounded-md hover:bg-light-black"
      >
        <FontAwesomeIcon
          class="w-6 h-6 fill-current text-gray-50"
          :icon="['fab', 'algolia']"
        ></FontAwesomeIcon>
        <div class="flex items-center justify-between flex-grow">
          <div>Nitro</div>
        </div>
      </div>
      <div class="mx-1 my-5">
        <div class="flex items-center justify-between mx-1 my-1">
          <div class="text-xs text-gray-400 uppercase">Direct Messages</div>
          <FontAwesomeIcon
            class="w-3 h-3 text-gray-400 fill-current"
            :icon="['fas', 'plus']"
          ></FontAwesomeIcon>
        </div>
        <div class="flex flex-col my-4 space-y-3">
          <div
            v-for="(directMessage, index) in directMessages"
            :key="index"
            class="flex items-center space-x-3"
          >
            <div class="relative flex-none">
              <img
                class="w-8 h-8 rounded-full"
                :src="
                  directMessage.image !== undefined
                    ? require(`~/assets/direct-messages/${directMessage.image}`)
                    : require('~/assets/direct-messages/default.png')
                "
                :alt="`Direct message with ${directMessage.name}`"
              />
              <div
                class="absolute bottom-0 right-0 w-3 h-3 rounded-full ring ring-dark-but-not-black"
                :class="[
                  directMessage.online
                    ? 'bg-green-500 border-0'
                    : 'border-4 border-gray-400 bg-gray-800',
                ]"
              ></div>
            </div>
            <div class="text-gray-400">
              <div class="text-sm truncate">
                {{ directMessage.name }}
              </div>
              <div
                v-if="directMessage.description"
                class="text-xs tracking-tighter"
              >
                {{ directMessage.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex flex-none w-full px-2 py-2 space-x-2 bg-black bg-opacity-20"
    >
      <div class="flex w-7/12">
        <div class="w-1/3">
          <div class="relative flex">
            <img
              :src="require('~/assets/images/ignisda-icon.png')"
              class="w-9/12"
              alt="ignisda icon"
            />
            <div
              class="absolute bottom-0.5 right-3 h-2.5 border-2 border-gray-400 w-2.5 bg-gray-800 rounded-full"
            ></div>
          </div>
        </div>
        <div class="flex flex-col w-2/3">
          <div class="text-sm font-bold tracking-tighter text-gray-200">
            IgnisDa
          </div>
          <div class="text-xs font-semibold text-gray-400 truncate">
            Honorary member of the Gurkans
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between w-5/12">
        <FontAwesomeIcon
          class="w-5 h-5 text-gray-300 cursor-pointer fill-current"
          :icon="['fas', 'microphone']"
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          class="w-5 h-5 text-gray-300 cursor-pointer fill-current"
          :icon="['fas', 'headphones']"
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          class="w-5 h-5 text-gray-300 cursor-pointer fill-current"
          :icon="['fas', 'cog']"
        ></FontAwesomeIcon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    directMessages: [
      { name: 'BouncePrime', image: 'bounce-prime.png' },
      {
        name: 'Python',
        image: 'python.png',
        description: 'Playing Commands: !help',
        online: true,
      },
      { name: 'MEE6', image: 'mee6.png' },
      { name: 'Shanku Danku', image: 'shanku-danku.png', online: true },
      { name: 'manan', image: 'manan.png' },
      { name: 'Calvin Candle', image: 'calvin-candle.png' },
      { name: 'singhtanmay345', image: 'singh-tanmay.png', online: true },
      { name: 'patryk.tech', image: 'patryk-tech.png' },
      { name: 'Deleted User', deleted: true },
      { name: 'SplendidDust', image: 'splendid-dust.png', online: true },
    ],
  }),
}
</script>
