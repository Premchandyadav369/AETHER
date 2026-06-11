'use client';

import React, { useEffect, useState } from 'react';
import { 
  Home, Activity, Database, Compass, RefreshCw, Zap, Cpu, 
  HelpCircle, Settings, User, Moon, Sun, Bell, Github, Code
} from 'lucide-react';
import { TabProvider, useTab, Tab } from './TabContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TabProvider>
      <RootLayoutInner>{children}</RootLayoutInner>
    </TabProvider>
  );
}

function RootLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const { activeTab, setActiveTab } = useTab();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    // Add magnetic and hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Smooth trail effect
  useEffect(() => {
    let animationFrameId: number;
    
    const updateTrail = () => {
      setTrailPos(prev => {
        const dx = cursorPos.x - prev.x;
        const dy = cursorPos.y - prev.y;
        // Adjust the division factor to change trail stiffness/lag
        return {
          x: prev.x + dx / 5,
          y: prev.y + dy / 5
        };
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };
    
    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [cursorPos]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Cursor styling based on active section
  const getCursorStyles = () => {
    let color = 'border-cyber-accent';
    let dotColor = 'bg-cyber-glow';
    let size = 'w-10 h-10';
    let extraEffect = '';

    switch (activeTab) {
      case 'proteins':
        color = 'border-pink-500 border-dashed animate-[spin_10s_linear_infinite]';
        dotColor = 'bg-pink-400';
        size = 'w-12 h-12';
        break;
      case 'molecules':
        color = 'border-emerald-500 rounded-[35%] animate-[pulse_2s_infinite]';
        dotColor = 'bg-emerald-400';
        size = 'w-11 h-11';
        break;
      case 'copilot':
        color = 'border-amber-500 shadow-neon-pink';
        dotColor = 'bg-amber-400';
        size = 'w-10 h-10';
        break;
      case 'workspace':
        color = 'border-indigo-500 border-double border-4';
        dotColor = 'bg-indigo-400';
        size = 'w-12 h-12';
        break;
      case 'dashboard':
        color = 'border-blue-500 border-t-transparent';
        dotColor = 'bg-blue-400';
        size = 'w-9 h-9 animate-[spin_3s_linear_infinite]';
        break;
      case 'pipeline':
        color = 'border-red-500 border-r-transparent border-l-transparent';
        dotColor = 'bg-red-400';
        size = 'w-11 h-11 animate-[spin_4s_linear_infinite]';
        break;
      case 'knowledge':
        color = 'border-purple-500';
        dotColor = 'bg-purple-400';
        size = 'w-13 h-13 border-spacing-2';
        break;
    }

    if (isHovering) {
      size = 'w-16 h-16 bg-white/5 border-white border-solid scale-110';
      dotColor = 'bg-white scale-125';
    }

    return { color, dotColor, size };
  };

  const cursorInfo = getCursorStyles();

  return (
    <html lang="en" className={theme}>
      <body className="bg-[#070a13] text-[#f3f4f6] min-h-screen flex flex-col relative select-none">
        
        {/* Custom cursor dot */}
        <div 
          className={`cursor-dot hidden md:block transition-transform duration-100 ${cursorInfo.dotColor}`} 
          style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} 
        />
        {/* Custom cursor outline with lag trail */}
        <div 
          className={`cursor-outline hidden md:block transition-all duration-75 flex items-center justify-center ${cursorInfo.color} ${cursorInfo.size}`} 
          style={{ left: `${trailPos.x}px`, top: `${trailPos.y}px` }} 
        />

        {/* Ambient mesh background glow */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-mesh-glow ambient-glow pointer-events-none z-0" />

        {/* Top Navbar */}
        <header className="glass-panel border-b border-[#1a233d] sticky top-0 w-full h-16 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
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
            {(['home', 'workspace', 'proteins', 'molecules', 'pipeline', 'copilot', 'dashboard', 'knowledge'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`hover:text-white transition-all duration-200 relative py-1 capitalize ${activeTab === tab ? 'text-white font-semibold' : ''}`}
              >
                {tab === 'copilot' ? 'AI Copilot' : tab === 'workspace' ? 'Studio' : tab === 'pipeline' ? 'Discovery Pipeline' : tab === 'knowledge' ? 'Knowledge Graph' : tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 shadow-neon" />
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('developer')}
              className={`p-2 transition-colors flex items-center gap-1.5 text-xs font-bold border rounded-lg ${
                activeTab === 'developer' 
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 shadow-neon' 
                  : 'text-[#9ca3af] hover:text-white border-transparent hover:bg-slate-900'
              }`}
              title="GitHub & API Documentation"
            >
              <Github size={16} />
              <span className="hidden sm:inline">Repo & API</span>
            </button>
            <button className="p-2 text-[#9ca3af] hover:text-white transition-colors" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="p-2 text-[#9ca3af] hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 shadow-neon-pink" />
            </button>
            <button 
              onClick={() => setActiveTab('pipeline')}
              className="hidden sm:block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-semibold text-sm transition-all duration-300 border border-blue-500/30 shadow-neon"
            >
              Launch Pipeline
            </button>
            <div className="w-8 h-8 rounded-full border border-purple-500/30 bg-purple-950 flex items-center justify-center text-xs font-bold text-pink-300">
              AR
            </div>
          </div>
        </header>

        {/* Main Body Layout */}
        <div className="flex flex-1 relative z-10">
          
          {/* Sidebar */}
          <aside className="glass-panel border-r border-[#1a233d] w-16 md:w-20 flex flex-col items-center py-6 gap-6 sticky top-16 h-[calc(100vh-64px)] z-30">
            <SidebarButton icon={<Home size={20} />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <SidebarButton icon={<Activity size={20} />} label="Workspace" active={activeTab === 'workspace'} onClick={() => setActiveTab('workspace')} />
            <SidebarButton icon={<Database size={20} />} label="Proteins" active={activeTab === 'proteins'} onClick={() => setActiveTab('proteins')} />
            <SidebarButton icon={<Compass size={20} />} label="Molecules" active={activeTab === 'molecules'} onClick={() => setActiveTab('molecules')} />
            <SidebarButton icon={<RefreshCw size={20} />} label="Pipeline" active={activeTab === 'pipeline'} onClick={() => setActiveTab('pipeline')} />
            <SidebarButton icon={<Zap size={20} />} label="AI Copilot" active={activeTab === 'copilot'} onClick={() => setActiveTab('copilot')} />
            <SidebarButton icon={<Cpu size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarButton icon={<HelpCircle size={20} />} label="Knowledge Graph" active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} />
            
            <div className="mt-auto flex flex-col gap-4">
              <SidebarButton icon={<Code size={20} />} label="API / GitHub" active={activeTab === 'developer'} onClick={() => setActiveTab('developer')} />
            </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#070a13] relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarButton({ icon, label, active = false, onClick }: SidebarButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`group relative p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
        active 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-neon' 
          : 'text-[#9ca3af] hover:bg-slate-900 hover:text-white border border-transparent'
      }`}
    >
      {icon}
      
      {/* Tooltip */}
      <span className="absolute left-16 scale-0 transition-all rounded bg-slate-950 px-2 py-1 text-xs text-white group-hover:scale-100 border border-slate-800 z-50 whitespace-nowrap shadow-xl">
        {label}
      </span>
    </button>
  );
}
