/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#5e60ce',
            light: '#7d7ffe',
            dark: '#4a4bb8',
          },
          secondary: {
            DEFAULT: '#64dfdf',
            light: '#72efef',
            dark: '#56bfbf',
          },
          dark: {
            DEFAULT: '#1a1a2e',
            darker: '#0f0f1a',
            medium: '#505073',
          },
          light: {
            DEFAULT: '#f8f9fa',
            lighter: '#ffffff',
          },
          success: '#06d6a0',
          warning: '#f9c74f',
          error: '#ef476f',
          info: '#118ab2',
        },
        borderRadius: {
          'sm': '6px',
          'md': '12px',
          'lg': '20px',
          'xl': '28px',
        },
        boxShadow: {
          'sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
          'md': '0 4px 12px rgba(0, 0, 0, 0.12)',
          'lg': '0 8px 24px rgba(0, 0, 0, 0.16)',
        },
        transitionDuration: {
          'fast': '0.2s',
          'medium': '0.3s',
          'slow': '0.5s',
        },
        fontFamily: {
          'cairo': ['Cairo', 'sans-serif'],
          'poppins': ['Poppins', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
  