module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        'border-radius': 'border-radius',
        'border-radius-and-color': 'border-radius, background-color',
        height: 'height',
      },
      borderRadius: {
        half: '50%',
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
  plugins: [require('tailwindcss-debug-screens')],
}
