/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF',
          light: '#3B82F6',
          dark: '#1E3A8A',
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#1E40AF',
          700: '#1E3A8A',
        },
        success: {
          DEFAULT: '#16A34A',
          50: '#F0FDF4',
          600: '#16A34A',
        },
        warning: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          600: '#F59E0B',
        },
        danger: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      borderRadius: {
        'card': '8px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
