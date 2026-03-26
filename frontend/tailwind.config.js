/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          teal:    '#2dd4bf',
          amber:   '#f59e0b',
          coral:   '#f87171',
          purple:  '#a78bfa',
        },
        dark: {
          bg:       '#0c1015',
          surface:  '#13181f',
          card:     '#181f29',
          border:   '#242d3a',
          borderHi: '#3a4d62',
          muted:    '#7a8fa6',
          hint:     '#3d4f62',
        },
        light: {
          bg:       '#f0f4f8',
          surface:  '#ffffff',
          card:     '#ffffff',
          border:   '#e2e8f0',
          borderHi: '#cbd5e1',
          muted:    '#64748b',
          hint:     '#94a3b8',
        }
      },
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
        mono:  ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}