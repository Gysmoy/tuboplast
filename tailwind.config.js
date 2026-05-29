/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.vue",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        primary: '#004991',
        secondary: '#F4E300',
        light: '#F5F5F5',
        silver: '#F1F5F9',
        dark: '#1A1C1C',
        darkmuted: '#424751',
        muted: '#737782',
        container: '#111827',
        success: '#10B981',
      },
      maxWidth: {
        site: '1280px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animated'),
  ],
}
