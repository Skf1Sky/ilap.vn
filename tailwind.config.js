/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // QUAN TRỌNG: Quét file .jsx trong thư mục src
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',       // Màu xanh thương hiệu
        'primary-hover': '#0056b3',
        dark: '#1b1b1b',
        graybody: '#f8f9fa'       // Màu nền xám nhạt (dùng cho vùng PC)
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}