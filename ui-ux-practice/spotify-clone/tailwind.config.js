const ignisnents = require('ignisnents/dist/tailwind-preset.js')

module.exports = {
  darkMode: 'class',
  purge: {
    content: ['node_modules/ignisnents/src/components/**/*.vue'],
  },
  presets: [ignisnents],
  theme: {
    extend: {
      colors: {
        'light-black': '#393636',
        'dark-black': '#121212',
        'spotify-green': '#1DB954',
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [
    require('tailwindcss-debug-screens'),
    require('@tailwindcss/line-clamp'),
  ],
}
