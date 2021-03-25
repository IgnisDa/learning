export const state = () => ({
  playing: false,
})

export const mutations = {
  toggleAudioPlaying(state) {
    state.playing = !state.playing
  },
  stopAudioPlaying(state) {
    state.playing = false
  },
}
