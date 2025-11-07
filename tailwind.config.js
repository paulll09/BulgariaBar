/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(15px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '60%': { transform: 'scale(1.05)', opacity: 1 },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out',
        fadeIn: 'fadeIn 0.8s ease-in',
        bounceIn: 'bounceIn 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
