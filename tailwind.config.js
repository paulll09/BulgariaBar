/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      keyframes: {
        overlayIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        overlayOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        modalIn: {
          '0%': { transform: 'translateY(24px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        modalOut: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(24px)', opacity: 0 },
        },
      },
      animation: {
        overlayIn: 'overlayIn .18s ease-out',
        overlayOut: 'overlayOut .18s ease-in forwards',
        modalIn: 'modalIn .22s ease-out',
        modalOut: 'modalOut .22s ease-in forwards',
      },
    },
  },
  plugins: [],
};
