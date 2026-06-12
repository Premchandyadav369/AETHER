/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aether: {
          bg: '#050816',
          bg2: '#081121',
          bg3: '#0B132B',
          card: '#0c1428',
          border: '#1a2744',
          primary: '#00E5FF',
          secondary: '#6EE7B7',
          accent: '#8B5CF6',
          danger: '#FF4D6D',
          success: '#22C55E',
          muted: '#64748b',
          text: '#e2e8f0',
        },
        cyber: {
          bg: '#050816',
          card: '#0c1428',
          border: '#1a2744',
          glow: '#00E5FF',
          accent: '#8B5CF6',
          gold: '#f59e0b',
          green: '#6EE7B7'
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,229,255,0.12) 0%, transparent 60%)',
        'mesh-accent': 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(139,92,246,0.08) 0%, transparent 50%)',
        'grid-scientific': 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-scientific': '40px 40px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 229, 255, 0.35)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.35)',
        'neon-green': '0 0 20px rgba(110, 231, 183, 0.35)',
        'neon-pink': '0 0 20px rgba(255, 77, 109, 0.35)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(0,229,255,0.05)',
      },
      animation: {
        'dash': 'dash 6s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit': 'orbit 3s linear infinite',
      },
      keyframes: {
        dash: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-230' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
