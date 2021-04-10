import passwordGenerator from 'generate-password'

export const state = () => ({
  generatedPassword: '',
  length: 20,
  lowercase: true,
  uppercase: false,
  numbers: false,
  symbols: false,
})

export const mutations = {
  generateAndSetPassword(state) {
    if (
      !state.uppercase &&
      !state.lowercase &&
      !state.numbers &&
      !state.symbols
    ) {
      state.generatedPassword = passwordGenerator.generate({ lowercase: true })
    } else {
      state.generatedPassword = passwordGenerator.generate({
        length: state.length,
        uppercase: state.uppercase,
        lowercase: state.lowercase,
        numbers: state.numbers,
        symbols: state.symbols,
      })
    }
  },
  setPasswordLength(state, length) {
    state.length = length
  },
  togglePasswordIncludeUppercase(state) {
    state.uppercase = !state.uppercase
  },
  togglePasswordIncludeLowercase(state) {
    if (!state.uppercase && !state.numbers && !state.symbols) {
      state.lowercase = true
    } else {
      state.lowercase = !state.lowercase
    }
  },
  togglePasswordIncludeNumbers(state) {
    state.numbers = !state.numbers
  },
  togglePasswordIncludeSymbols(state) {
    state.symbols = !state.symbols
  },
}
