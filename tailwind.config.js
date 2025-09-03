module.exports = {
  content: [
    'src/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        header: ['Montserrat']
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
