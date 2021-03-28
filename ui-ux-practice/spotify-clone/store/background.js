export const state = () => ({
  backgroundColor: 'blue',
})

const COLORS = ['red', 'green', 'blue', 'light-black']

export const mutations = {
  resetBackgroundColor(state) {
    state.backgroundColor = 'blue'
  },
  randomBackgroundColor(state) {
    state.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)]
  },
}
