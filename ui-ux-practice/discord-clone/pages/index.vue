<template>
  <div class="flex flex-col h-screen px-5">
    <div class="flex-grow mt-12 mb-4 overflow-auto">
      <div v-for="index in 200" :key="index" class="flex py-2 space-x-3">
        <img
          src="https://picsum.photos/300.webp"
          class="flex-none object-cover w-10 h-10 rounded-full"
          alt="kitty"
        />
        <div class="flex flex-col pr-20 space-y-1">
          <div class="flex items-center space-x-2">
            <div class="font-semibold text-gray-100">{{ getRandomName() }}</div>
            <div class="text-sm text-gray-500">{{ getRandomDate() }}</div>
          </div>
          <div class="text-sm text-gray-300">
            {{ getRandomText() }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex-none" style="height: 68px">
      <MessageInput></MessageInput>
    </div>
  </div>
</template>

<script>
import { LoremIpsum } from 'lorem-ipsum'

export default {
  methods: {
    getRandomName() {
      return new LoremIpsum().generateWords(1)
    },
    getRandomDate(start = new Date(), end = new Date()) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      ).toLocaleDateString('en-US')
    },
    getRandomText() {
      const lorem = new LoremIpsum({
        sentencesPerParagraph: {
          max: 8,
          min: 4,
        },
        wordsPerSentence: {
          max: 16,
          min: 4,
        },
      })
      return lorem.generateParagraphs(3)
    },
  },
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 12px;
  @apply bg-dark-but-not-black;
}

::-webkit-scrollbar-thumb {
  @apply bg-not-quite-black rounded-lg;
}
</style>
