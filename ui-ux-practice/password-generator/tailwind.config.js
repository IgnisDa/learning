const colors = require('tailwindcss/colors')
const ignisnents = require('ignisnents/dist/tailwind-preset.js')

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  presets: [ignisnents],
  purge: {
    content: ['node_modules/ignisnents/src/components/**/*.vue'],
  },
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        fuchsia: colors.fuchsia,
        cyan: colors.cyan,
      },
      fontFamily: {
        display: ['Josefin Sans', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwindcss-debug-screens')],
}
