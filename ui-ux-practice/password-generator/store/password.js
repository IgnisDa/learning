import passwordGenerator from 'generate-password'

export const state = () => ({
  generatedPassword: '',
  config: {},
})

export const mutations = {
  generateAndSetPassword(state) {
    state.generatedPassword = passwordGenerator.generate(state.config)
  },
  setPasswordLength(state, length) {
    state.config.length = length
  },
  togglePasswordIncludeUppercase(state) {
    state.config.uppercase = !state.config.uppercase
  },
  togglePasswordIncludeLowercase(state) {
    state.config.lowercase = !state.config.lowercase
  },
  togglePasswordIncludeNumbers(state) {
    state.config.numbers = !state.config.numbers
  },
  togglePasswordIncludeSymbols(state) {
    state.config.symbols = !state.config.symbols
  },
}
