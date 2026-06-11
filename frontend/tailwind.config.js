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
        cyber: {
          bg: '#070a13',      // Deep space black
          card: '#0c101e',    // Deep glassmorphic navy
          border: '#1a233d',  // Subtle metallic blue
          glow: '#3b82f6',    // Electric blue neon glow
          accent: '#ec4899',  // Cyber pink
          gold: '#f59e0b',    // Gold ligand highlight
          green: '#10b981'    // Active success neon green
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-glow': 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)'
      },
      boxShadow: {
        'neon': '0 0 15px rgba(59, 130, 246, 0.4)',
        'neon-pink': '0 0 15px rgba(236, 72, 153, 0.4)',
        'neon-green': '0 0 15px rgba(16, 185, 129, 0.4)'
      }
    },
  },
  plugins: [],
}
