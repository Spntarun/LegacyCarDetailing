/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060D18',
          900: '#0A1628',
          850: '#0E1D33',
          800: '#13243E',
          700: '#1E355B',
        },
        cyan: {
          glow: '#00D4FF',
          deep: '#0099CC',
          dark: '#006688',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 212, 255, 0.35)',
        'glow-cyan-lg': '0 0 45px rgba(0, 212, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
