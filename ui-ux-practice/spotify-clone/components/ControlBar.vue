<template>
  <div id="control-bar" class="h-[90px] bg-dark-black flex items-center">
    <div class="w-[32%]"></div>
    <div class="w-[36%] flex flex-col items-center h-full justify-center py-2">
      <div class="flex items-center justify-center h-2/3">
        <button
          class="transition-transform duration-200 focus:outline-none pressed-effect"
          @click="toggleAudioPlayingMutation()"
        >
          <FontAwesomeIcon
            :icon="['fas', audioPlayingState ? 'pause-circle' : 'play-circle']"
            class="w-8 h-8 text-gray-100 cursor-pointer"
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
    <div class="w-[32%] flex items-center h-full justify-end">
      <div class="flex items-center space-x-2">
        <FontAwesomeIcon
          class="w-5 h-5 text-gray-400"
          :icon="['fas', 'key']"
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          class="w-5 h-5 text-gray-400"
          :icon="['fas', 'layer-group']"
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          class="w-5 h-5 text-gray-400"
          :icon="['fas', 'laptop-house']"
        ></FontAwesomeIcon>
      </div>
      <div class="flex items-center space-x-2">
        <FontAwesomeIcon
          class="flex-none w-5 h-5 text-gray-400"
          :icon="['fas', 'volume-up']"
        ></FontAwesomeIcon>
        <div class="relative flex-grow w-24 h-1 rounded-2xl bg-light-black">
          <div
            class="absolute inset-0 h-full bg-gray-500 transition-width"
            :style="{ width: `${audioVolume}%` }"
          ></div>
          <div
            class="absolute z-10 w-2 h-2 bg-white rounded-full cursor-pointer bottom-[]"
            :style="{ left: `${audioVolume}%` }"
          ></div>
        </div>
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
  }),
  computed: {
    ...mapState({
      audioPlayingState: (state) => state.audio.playing,
    }),
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
  @apply appearance-none h-2 w-2 rounded-full bg-white outline-none;
}
</style>
