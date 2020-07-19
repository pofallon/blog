module.exports = {
  purge: [
    'src/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        header: ['Montserrat']
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography')
  ],
}
