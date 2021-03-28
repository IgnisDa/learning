export const state = () => ({
  backgroundColor: 'green',
})

const COLORS = ['red', 'green', 'blue', 'light-black']

export const mutations = {
  setBackgroundColor(state, color) {
    state.backgroundColor = color
  },
  randomBackgroundColor(state) {
    state.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)]
  },
}
