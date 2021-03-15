<template>
  <div id="user-bar" class="h-screen overflow-auto bg-dark-but-not-black">
    <div
      class="fixed flex items-center justify-around h-12 px-2 space-x-3 border-b border-black bg-light-black border-opacity-70"
    >
      <div
        class="flex items-center justify-between w-3/5 px-2 py-1 rounded-md bg-almost-black"
      >
        <input
          type="text"
          placeholder="Search"
          class="w-4/5 text-sm font-light tracking-tight text-gray-500 focus:outline-none bg-almost-black"
        />
        <FontAwesomeIcon
          class="flex-none w-3 h-3 text-gray-400 cursor-pointer fill-current hover:text-gray-200"
          :icon="['fas', 'search']"
        ></FontAwesomeIcon>
      </div>
      <FontAwesomeIcon
        class="flex-none w-5 h-5 text-gray-400 cursor-pointer fill-current hover:text-gray-200"
        :icon="['fas', 'inbox']"
      ></FontAwesomeIcon>
      <FontAwesomeIcon
        class="flex-none w-5 h-5 text-gray-400 cursor-pointer fill-current hover:text-gray-200"
        :icon="['fas', 'question']"
      ></FontAwesomeIcon>
    </div>
    <div class="mx-4 mt-14">
      <div
        v-for="(userNames, userType, index) in users"
        :key="index"
        class="py-3 text-sm"
      >
        <div>
          <div
            class="text-xs font-semibold tracking-wider text-gray-400 uppercase"
          >
            {{ userType }}-{{ userNames.length }}
          </div>
          <div>
            <div
              v-for="(username, userIndex) in userNames"
              :key="userIndex"
              class="flex items-center py-2 space-x-3 text-green-500"
            >
              <img
                :src="`https://picsum.photos/seed/${getRandomString()}/300`"
                :alt="`'s image`"
                class="w-8 h-8 rounded-full"
              />
              <div>{{ username }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import slugify from 'slugify'
import { getRandomString } from '~/utils.js'

export default {
  data: () => ({
    users: {
      'tailwind labs': ['simonswiss'],
      'community manager': ['Sophia'],
      pro: ['andrew.welch'],
      booster: ['alistair'],
      online: [
        '10b2',
        'Adam Listek',
        'Aditya',
        'adprasetyo',
        'Agoto',
        'abstruse',
        'arn',
        'Atom',
        'axsuul',
        'bakunawa',
        'bbworld',
        'benzi',
      ],
    },
  }),
  methods: {
    getImage(name) {
      return slugify(name, { lower: true })
    },
    getRandomString() {
      return getRandomString()
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
