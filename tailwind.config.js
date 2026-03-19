/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      // Puedes agregar personalizaciones aquí si es necesario
      colors: {
        primary: '#06B6D4',
        light: '#ffffff',
        dark: '#0C111C',
        muted: '#94A3B8',
        container: '#111827',
        success: '#10B981'
      }
    },
  },
  plugins: [
    require('tailwindcss-animated'),
    // Otros plugins si los tienes
  ],
}
