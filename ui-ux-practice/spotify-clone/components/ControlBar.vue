<template>
  <div
    id="control-bar"
    class="h-[90px] bg-[#181818] border-t-[0.1px] border-gray-700 flex items-center"
  >
    <div class="w-[32%] pl-4 flex items-center h-full justify-start space-x-4">
      <div class="relative cursor-pointer w-14 h-14">
        <img
          src="https://i.scdn.co/image/ab67616d000048514dea4c1cdf30c359dbaec318"
          alt="spotify-image-thumbnail"
          class="object-cover"
          @mouseover="hoverOnImage = true"
          @mouseout="hoverOnImage = false"
        />
        <div
          class="absolute p-1 bg-black rounded-full pointer-events-none top-1 right-1 bg-opacity-70"
        >
          <FontAwesomeIcon
            :icon="['fas', 'angle-up']"
            class="w-5 h-5 text-gray-100 cursor-pointer pointer-events-none"
            :class="{ hidden: !hoverOnImage }"
          ></FontAwesomeIcon>
        </div>
      </div>
      <div class="flex flex-col space-y-[1px]">
        <div
          class="text-sm font-semibold text-gray-200 cursor-pointer hover:underline"
        >
          {{ audio.name }}
        </div>
        <div class="space-x-1 text-xs tracking-tight text-gray-400">
          <span
            v-for="(artist, index) in audio.artists"
            :key="index"
            class="cursor-pointer hover:underline"
          >
            {{ artist }}
          </span>
        </div>
      </div>
      <div class="flex space-x-4">
        <FontAwesomeIcon
          :icon="['fas', 'heart']"
          class="w-4 h-4 text-gray-400 cursor-pointer"
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          :icon="['fas', 'laptop']"
          class="w-4 h-4 text-gray-400 cursor-pointer"
        ></FontAwesomeIcon>
      </div>
    </div>
    <div class="w-[36%] flex flex-col items-center h-full justify-center py-3">
      <div class="flex items-center justify-center space-x-6 h-2/3">
        <button
          class="transition-transform duration-200 focus:outline-none pressed-effect"
        >
          <FontAwesomeIcon
            :icon="['fas', 'redo']"
            class="w-4 h-4 text-gray-400 cursor-pointer"
          ></FontAwesomeIcon>
        </button>
        <button
          class="transition-transform duration-200 focus:outline-none pressed-effect"
        >
          <FontAwesomeIcon
            :icon="['fas', 'step-backward']"
            class="w-4 h-4 text-gray-400 cursor-pointer"
          ></FontAwesomeIcon>
        </button>
        <button
          class="transition-transform duration-200 focus:outline-none pressed-effect"
          @click="toggleAudioPlayingMutation()"
        >
          <FontAwesomeIcon
            :icon="['fas', audioPlayingState ? 'pause-circle' : 'play-circle']"
            class="w-8 h-8 text-gray-100 cursor-pointer"
          ></FontAwesomeIcon>
        </button>
        <button
          class="transition-transform duration-200 focus:outline-none pressed-effect"
        >
          <FontAwesomeIcon
            :icon="['fas', 'step-forward']"
            class="w-4 h-4 text-gray-400 cursor-pointer"
          ></FontAwesomeIcon>
        </button>
        <button
          class="transition-transform duration-200 focus:outline-none pressed-effect"
        >
          <FontAwesomeIcon
            :icon="['fas', 'random']"
            class="w-4 h-4 text-gray-400 cursor-pointer"
          ></FontAwesomeIcon>
        </button>
      </div>
      <div class="flex items-center w-full space-x-3 h-1/3">
        <div class="flex-none text-xs font-bold text-gray-400">
          {{ currentDuration }}
        </div>
        <div
          class="relative flex-grow h-1 overflow-hidden rounded-2xl bg-light-black"
        >
          <div
            class="absolute inset-0 h-full bg-gray-500 transition-width"
            :style="{ width: `${progressBarWidth}%` }"
          ></div>
        </div>
        <div class="flex-none text-xs font-bold text-gray-400">
          {{ totalDuration }}
        </div>
      </div>
    </div>
    <div class="w-[32%] flex items-center h-full justify-end space-x-4 pr-4">
      <div class="flex items-center space-x-3">
        <div title="Lyrics">
          <ig-icon
            size="xs"
            name="key"
            class="text-gray-200 cursor-pointer"
          ></ig-icon>
        </div>
        <div title="Queue">
          <ig-icon
            size="xs"
            name="archive"
            class="text-gray-200 cursor-pointer"
          ></ig-icon>
        </div>
        <div title="Connect to a device">
          <ig-icon
            size="xs"
            name="tablet"
            class="text-gray-200 cursor-pointer"
          ></ig-icon>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <ig-icon
          :name="audioVolume === '0' ? 'volume-x' : 'volume-2'"
          class="text-gray-200"
        ></ig-icon>
        <input
          v-model="audioVolume"
          min="0"
          max="100"
          type="range"
          class="flex-grow w-24 h-1 appearance-none slider focus:outline-none rounded-2xl bg-light-black"
        />
      </div>
    </div>
    <audio id="audio-holder" class="hidden" preload="metadata">
      <div class=""></div>
      <source :src="audioSource" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data: () => ({
    audioElement: null,
    progressBarWidth: 0,
    audioSource: 'https://soundbible.com/mp3/old-car-engine_daniel_simion.mp3',
    currentDuration: '00:00',
    totalDuration: '00:00',
    audioVolume: 60,
    hoverOnImage: false,
    audio: {
      name: 'Eenie Meenie',
      artists: ['Sean Kingston', 'Justin Beiber'],
    },
  }),
  head() {
    if (this.audioPlayingState) {
      return { title: `${this.audio.name} ‧ ${this.getAudioArtists}` }
    } else {
      return { title: 'Spotify Player' }
    }
  },
  computed: {
    ...mapState({
      audioPlayingState: (state) => state.audio.playing,
    }),
    getAudioArtists() {
      return this.audio.artists.join(', ')
    },
  },
  watch: {
    progressBarWidth(newValue) {
      if (newValue >= 100) {
        this.stopAudioPlayingMutation()
      }
    },
    audioVolume(newValue) {
      this.audioElement.volume = newValue / 100
    },
    audioPlayingState(newValue) {
      if (newValue) {
        this.audioElement.play()
      } else {
        this.audioElement.pause()
      }
    },
  },
  mounted() {
    this.audioElement = document.getElementById('audio-holder')
    this.audioElement.addEventListener('loadedmetadata', () => {
      const currentDuration = this.audioElement.currentTime
      const totalDuration = this.audioElement.duration
      this.currentDuration = this.toMinutes(currentDuration)
      this.totalDuration = this.toMinutes(totalDuration)
      this.interval = window.setInterval(this.onTimeUpdate, 1000)
      this.currentDuration = this.audioElement.currentTime
      this.totalDuration = this.audioElement.duration
      this.audioElement.volume = this.audioVolume / 100
      // space key toggles playing audio
      window.addEventListener('keypress', this.toggleAudioPlaying)
    })
  },
  beforeDestroy() {
    clearInterval(this.interval)
    window.removeEventListener('keypress', this.toggleAudioPlaying)
  },
  methods: {
    ...mapMutations({
      toggleAudioPlayingMutation: 'audio/toggleAudioPlaying',
      stopAudioPlayingMutation: 'audio/stopAudioPlaying',
    }),
    toMinutes(secs) {
      return new Date(null, null, null, null, null, secs)
        .toTimeString()
        .split(' ')[0]
        .substring(3)
    },
    toggleAudioPlaying(e) {
      if (e.keyCode === 32) {
        this.toggleAudioPlayingMutation()
      }
    },
    onTimeUpdate() {
      const currentDuration = this.audioElement.currentTime
      const totalDuration = this.audioElement.duration
      this.currentDuration = this.toMinutes(currentDuration)
      this.totalDuration = this.toMinutes(totalDuration)
      this.progressBarWidth = (currentDuration / totalDuration) * 100
    },
  },
}
</script>

<style lang="scss" scoped>
.pressed-effect:active {
  @apply transform scale-125;
}

.slider::-webkit-slider-thumb {
  @apply appearance-none h-2 w-2 rounded-full bg-gray-200 outline-none cursor-pointer;
}
</style>
