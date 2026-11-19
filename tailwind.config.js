/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--bg-base)',
        'bg-surface': 'var(--bg-surface)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-blue': 'var(--accent-blue)',
        'accent-violet': 'var(--accent-violet)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        'q-force': 'var(--q-force)',
        'q-velocity': 'var(--q-velocity)',
        'q-acceleration': 'var(--q-acceleration)',
        'q-electric': 'var(--q-electric)',
        'q-magnetic': 'var(--q-magnetic)',
        'q-torque': 'var(--q-torque)',
        'q-momentum': 'var(--q-momentum)',
        'q-energy': 'var(--q-energy)',
        'lvl-g12': 'var(--lvl-g12)',
        'lvl-y1': 'var(--lvl-y1)',
        'lvl-y2': 'var(--lvl-y2)',
        'lvl-y3': 'var(--lvl-y3)',
        'lvl-y4': 'var(--lvl-y4)',
      },
      fontFamily: {
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        panel: '20px',
        pill: '999px',
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0,0,0,0.45)',
        'glow-cyan': '0 0 24px rgba(34,211,238,0.25)',
      },
      backdropBlur: {
        glass: '28px',
        'glass-light': '20px',
      },
    },
  },
  plugins: [],
};
