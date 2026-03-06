/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        heading: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        navy: {
          DEFAULT: 'var(--navy)',
          mid: 'var(--navy-mid)',
          light: 'var(--navy-light)',
          card: 'var(--navy-card)',
          hover: 'var(--navy-hover)',
        },
        yellow: 'var(--yellow)',
        gold: {
          DEFAULT: 'var(--gold)',
          light: 'var(--gold-light)',
          dim: 'var(--gold-dim)',
          glow: 'var(--gold-glow)',
        },
        slate: {
          DEFAULT: 'var(--slate)',
          dim: 'var(--slate-dim)',
        },
        white: {
          DEFAULT: 'var(--white)',
          dim: 'var(--white-dim)',
        },
        green: 'var(--green)',
        amber: 'var(--amber)',
        red: 'var(--red)',
      },
    },
  },
  plugins: [],
}
