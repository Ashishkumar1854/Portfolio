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
        'bg-primary':    'var(--color-bg-primary)',
        'bg-secondary':  'var(--color-bg-secondary)',
        'bg-card':       'var(--color-bg-card)',
        'bg-elevated':   'var(--color-bg-elevated)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-active': 'var(--color-border-active)',
        'accent-blue':   '#4f8eff',
        'accent-purple': '#a855f7',
        'accent-cyan':   '#22d3ee',
        'accent-green':  '#10b981',
        'accent-amber':  '#f59e0b',
        'text-primary':  'var(--color-text-primary)',
        'text-secondary':'var(--color-text-secondary)',
        'text-muted':    'var(--color-text-muted)',
        'light-bg':       '#fafafe',
        'light-card':     '#ffffff',
        'light-text':     '#0a0a1a',
        'light-sub':      '#44445a',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero':    ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display': ['clamp(1.8rem, 4vw, 3rem)', { lineHeight: '1.1' }],
        'title':   ['clamp(1.2rem, 2.5vw, 1.75rem)', { lineHeight: '1.3' }],
      },
      boxShadow: {
        'card':      '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
        'card-hover':'0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,142,255,0.2)',
        'glow-blue': '0 0 40px rgba(79,142,255,0.3)',
        'glow-purple':'0 0 40px rgba(168,85,247,0.3)',
      },
      backdropBlur: {
        'xs': '4px',
        'glass': '12px',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'slide-up':   'slideUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'counter':    'counter 2s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
