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
        primary: '#003368',
        secondary: '#F4E300',
        light: '#ffffff',
        dark: '#0C111C',
        muted: '#94A3B8',
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
