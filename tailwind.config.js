/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aws: {
          // AWS Primary Colors
          orange: '#ff9900',
          'orange-dark': '#ec7211',
          'orange-light': '#ffac33',
          'orange-pale': '#fff3e0',
          
          // AWS Secondary Colors  
          blue: '#232f3e',
          'blue-dark': '#161e2d',
          'blue-light': '#37475a',
          'blue-pale': '#f1f3f3',
          
          // AWS Neutral Colors with proper contrast
          gray: {
            25: '#fcfcfd',    // Ultra light background
            50: '#f9fafb',    // Light background
            100: '#f2f4f7',   // Card backgrounds
            200: '#eaecf0',   // Borders
            300: '#d0d5dd',   // Disabled states
            400: '#98a2b3',   // Placeholder text
            500: '#667085',   // Secondary text
            600: '#475467',   // Primary text on light
            700: '#344054',   // Headings on light
            800: '#1d2939',   // Dark headings
            900: '#101828',   // Darkest text
          },
          
          // AWS Status Colors
          success: {
            50: '#f0fdf4',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
          },
          warning: {
            50: '#fffbeb',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
          },
          error: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
          },
          
          // AWS Cloud Colors
          squid: '#232f3e',      // AWS Squid Ink
          smile: '#ff9900',      // AWS Smile Orange
          'light-blue': '#4285f4', // AWS Light Blue
          'dark-blue': '#0f1419',  // AWS Dark Blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
} 