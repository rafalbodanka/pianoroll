/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      height: {
        'calc-h-screen': 'calc(100vh - 44px - 3em - 80px)',
      },
    },
  },
  plugins: [],
}

