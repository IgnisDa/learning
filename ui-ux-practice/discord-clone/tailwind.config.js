module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        'border-radius': 'border-radius',
        'border-radius-and-color': 'border-radius, background-color',
      },
      colors: {
        blurple: '#7289DA',
        'dark-but-not-black': '#2C2F33',
        'not-quite-black': '#23272A',
        'almost-black': '#202225',
        'light-black': '#36393F',
      },
    },
  },
  variants: {
    extend: {
      padding: ['first', 'last'],
      borderRadius: ['hover'],
    },
  },
  plugins: [require('tailwindcss-debug-screens')],
}
