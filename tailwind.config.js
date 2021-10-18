module.exports = {
  mode: 'jit',
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    safelist: [
      "bg-gray-800",
      "text-gray-100",
      "p-3",
      "max-w-sm"
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        large: "48rem",
        huge: "60rem"
      },
      spacing: {
        '108': '32rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
