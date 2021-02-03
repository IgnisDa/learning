export const state = () => ({
  isOpen: false,
})

export const mutations = {
  toggleNavbar(state) {
    state.isOpen = !state.isOpen
  },
}
