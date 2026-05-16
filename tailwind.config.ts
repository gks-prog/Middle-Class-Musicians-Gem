import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#111111',
        foreground: '#FFFFFF',
        muted: '#888888',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        editorial: ['var(--font-playfair)', 'serif'],
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}
export default config
