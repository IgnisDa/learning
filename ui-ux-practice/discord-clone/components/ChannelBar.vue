<template>
  <div id="channel-bar" class="flex flex-col bg-dark-but-not-black">
    <div
      class="flex items-center justify-center flex-none h-12 border-b border-black shadow-2xl bg-dark-but-not-black border-opacity-70"
    >
      <input
        type="text"
        placeholder="Find or start a conversation"
        class="w-full px-2 py-1 mx-2 text-sm font-light tracking-tight text-gray-500 focus:outline-none bg-almost-black"
      />
    </div>
    <div class="flex-grow pr-2 mx-3 overflow-x-hidden overflow-y-auto">
      <div>
        <div
          class="flex items-center py-2 space-x-4 tracking-tight text-gray-300 rounded-md hover:bg-light-black"
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
          class="flex items-center py-2 space-x-5 tracking-tight text-gray-300 rounded-md hover:bg-light-black"
        >
          <FontAwesomeIcon
            class="w-6 h-6 fill-current text-gray-50"
            :icon="['fab', 'algolia']"
          ></FontAwesomeIcon>
          <div class="flex items-center justify-between flex-grow">
            <div>Nitro</div>
          </div>
        </div>
      </div>
      <div class="flex flex-col my-5">
        <div class="flex items-center justify-between flex-none mx-1 my-1">
          <div class="text-xs text-gray-400 uppercase">Direct Messages</div>
          <FontAwesomeIcon
            class="w-3 h-3 text-gray-400 fill-current"
            :icon="['fas', 'plus']"
          ></FontAwesomeIcon>
        </div>
        <div class="flex flex-col flex-grow my-4 space-y-3">
          <div
            v-for="(directMessage, index) in directMessages"
            :key="index"
            class="flex items-center space-x-3"
          >
            <div v-if="!directMessage.deleted" class="relative flex-none">
              <img
                class="w-8 h-8 rounded-full"
                :src="`https://picsum.photos/seed/${getRandomString()}/300`"
                :alt="`Direct message with ${directMessage.name}`"
                loading="lazy"
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
            <div v-else class="flex-none">
              <img
                class="w-8 h-8 rounded-full"
                src="https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png"
                :alt="`Direct message with ${directMessage.name}`"
                loading="lazy"
              />
            </div>
            <div class="text-gray-400 truncate">
              <div v-if="!directMessage.deleted">
                <div class="text-sm truncate">
                  {{ directMessage.name }}
                </div>
                <div
                  v-if="directMessage.description"
                  class="text-xs tracking-tighter truncate"
                >
                  {{ directMessage.description }}
                </div>
              </div>
              <div v-else>
                <div class="text-sm truncate">
                  Deleted User {{ getRandomString() }}
                </div>
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
              :src="`https://picsum.photos/seed/${getRandomString()}/900`"
              class="w-9/12 rounded-full"
              alt="ignisda icon"
              loading="lazy"
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
import { LoremIpsum } from 'lorem-ipsum'
import { getRandomString } from '~/utils.js'

export default {
  data: () => ({ directMessages: [] }),
  async fetch() {
    const { results } = await this.$axios.$get(
      'https://randomuser.me/api/?results=20'
    )
    const directMessages = []
    for (const user of results) {
      const deleted = Math.random() < 0.1
      const online = deleted ? false : Math.random() < 0.5
      let description = null
      if (Math.random() > 0.5) {
        description = this.getRandomDescription()
      }
      directMessages.push({
        name: user.login.username,
        online,
        deleted,
        description,
      })
    }
    this.directMessages = directMessages
  },
  methods: {
    getRandomString() {
      return getRandomString()
    },
    getRandomDescription() {
      return new LoremIpsum().generateWords(10)
    },
  },
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  background: transparent;
  width: 0;
}
</style>
