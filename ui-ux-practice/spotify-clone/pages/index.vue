<template>
  <div class="flex flex-col w-full px-6 mb-6 overflow-y-auto">
    <div class="flex-none">
      <div>
        <div class="text-3xl font-extrabold text-gray-50">
          <span>Good afternoon</span>
        </div>
        <div
          class="grid grid-cols-1 my-6 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 xl:grid-cols-4"
        >
          <CardHorizontal
            v-for="(audioDetails, index) in audios.sort(
              () => 0.5 - Math.random()
            )"
            :key="index"
            :audio-details="audioDetails"
          ></CardHorizontal>
        </div>
      </div>
      <div v-for="repeatIndex in 4" :key="repeatIndex" class="mt-6">
        <div class="text-2xl font-extrabold tracking-wider text-gray-50">
          <span class="cursor-pointer hover:underline">Recently played</span>
        </div>
        <div
          class="grid grid-cols-2 my-6 overflow-hidden gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 h-[290px] sm:h-[318px] md:h-[314px] lg:h-[305px] 2xl:h-[260px]"
        >
          <CardVertical
            v-for="(audioDetails, index) in audios.sort(
              () => 0.5 - Math.random()
            )"
            :key="index"
            :audio-details="audioDetails"
          ></CardVertical>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $http }) {
    const getAudioDetails = (data) => {
      const audios = []
      for (const audio of data.results.splice(0, 8)) {
        const audioObj = {
          imageUrl: audio.artworkUrl100,
          name: audio.trackName,
          playlist: audio.collectionName,
        }
        audios.push(audioObj)
      }
      return audios
    }
    const res = await $http.get(
      'https://itunes.apple.com/search?country=IN&term=maroon5&limit=2000'
    )
    const data = await res.json()
    const audios = getAudioDetails(data)
    return { audios }
  },
  methods: {},
}
</script>
