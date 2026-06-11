'use client';

import React, { useEffect, useState } from 'react';
import { 
  Home, Activity, Database, Compass, RefreshCw, Zap, Cpu, 
  HelpCircle, Settings, User, Moon, Sun, Search, Bell
} from 'lucide-react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <html lang="en" className={theme}>
      <body className="bg-[#070a13] text-[#f3f4f6] min-h-screen flex flex-col relative select-none">
        
        {/* Custom cursor trails */}
        <div 
          className="cursor-dot hidden md:block" 
          style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} 
        />
        <div 
          className="cursor-outline hidden md:block" 
          style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} 
        />

        {/* Ambient mesh background glow */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-mesh-glow ambient-glow pointer-events-none z-0" />

        {/* Top Navbar */}
        <header className="glass-panel border-b border-[#1a233d] sticky top-0 w-full h-16 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-neon">
              A
            </div>
            <div>
              <span className="font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400">
                AETHER-RAMI
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
                V6
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm text-[#9ca3af]">
            {['Home', 'Platform', 'Research', 'Features', 'Dashboard', 'Docs', 'API', 'Community'].map((link) => (
              <a 
                key={link}
                href="#" 
                onClick={() => setActiveTab(link)}
                className={`hover:text-white transition-colors duration-200 relative py-1 ${activeTab === link ? 'text-white font-semibold' : ''}`}
              >
                {link}
                {activeTab === link && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 shadow-neon" />
                )}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#9ca3af] hover:text-white transition-colors" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="p-2 text-[#9ca3af] hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 shadow-neon-pink" />
            </button>
            <button className="hidden sm:block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-semibold text-sm transition-all duration-300 border border-blue-500/30 shadow-neon">
              Launch App
            </button>
            <div className="w-8 h-8 rounded-full border border-purple-500/30 bg-purple-950 flex items-center justify-center text-xs font-bold text-pink-300">
              U
            </div>
          </div>
        </header>

        {/* Main Body Layout */}
        <div className="flex flex-1 relative z-10">
          
          {/* Sidebar */}
          <aside className="glass-panel border-r border-[#1a233d] w-16 md:w-20 flex flex-col items-center py-6 gap-6 sticky top-16 h-[calc(100vh-64px)] z-30">
            <SidebarButton icon={<Home size={20} />} label="Home" active />
            <SidebarButton icon={<Activity size={20} />} label="Studio" />
            <SidebarButton icon={<Database size={20} />} label="Proteins" />
            <SidebarButton icon={<Compass size={20} />} label="Molecules" />
            <SidebarButton icon={<RefreshCw size={20} />} label="Retrieval" />
            <SidebarButton icon={<Zap size={20} />} label="Generate" />
            <SidebarButton icon={<Cpu size={20} />} label="ADMET" />
            <SidebarButton icon={<HelpCircle size={20} />} label="Explain" />
            <div className="mt-auto flex flex-col gap-4">
              <SidebarButton icon={<Settings size={20} />} label="Settings" />
              <SidebarButton icon={<User size={20} />} label="Profile" />
            </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#070a13] relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function SidebarButton({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button 
      className={`group relative p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
        active 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-neon' 
          : 'text-[#9ca3af] hover:bg-slate-900 hover:text-white border border-transparent'
      }`}
    >
      {icon}
      
      {/* Tooltip */}
      <span className="absolute left-16 scale-0 transition-all rounded bg-slate-950 px-2 py-1 text-xs text-white group-hover:scale-100 border border-slate-800 z-50">
        {label}
      </span>
    </button>
  );
}
