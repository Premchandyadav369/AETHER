'use client';

import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, Atom, Scan, Dna, Activity, Layers3 } from 'lucide-react';

export type ProteusNavTab = 'Structure' | 'Residues' | 'Binding Sites' | 'Proteins' | 'Analysis' | 'Live View';

interface NavigationProps {
  activeTab?: ProteusNavTab;
  onTabChange?: (tab: ProteusNavTab) => void;
  onGetStarted?: () => void;
  className?: string;
}

const NAV_ITEMS: ProteusNavTab[] = [
  'Structure',
  'Residues',
  'Binding Sites',
  'Proteins',
  'Analysis',
  'Live View'
];

export default function Navigation({
  activeTab = 'Structure',
  onTabChange,
  onGetStarted,
  className = ''
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tab: ProteusNavTab) => {
    onTabChange?.(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 select-none ${className}`}
      aria-label="Main Navigation"
    >
      {/* Brand: Geometric Logo + Wordmark */}
      <div className="flex items-center gap-3">
        <a
          href="#structure"
          onClick={(e) => {
            e.preventDefault();
            handleSelectTab('Structure');
          }}
          className="flex items-center gap-3 text-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg p-1"
        >
          {/* Geometric Structural / Molecular Diamond Logo (26x26) */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <polygon
              points="128,18 238,128 128,238 18,128"
              stroke="#FFFFFF"
              strokeWidth="14"
              strokeLinejoin="round"
              fill="rgba(255, 255, 255, 0.04)"
            />
            <circle cx="128" cy="128" r="32" stroke="#FFFFFF" strokeWidth="12" fill="#000000" />
            <circle cx="128" cy="128" r="10" fill="#e8702a" />
            <line x1="128" y1="18" x2="128" y2="96" stroke="#FFFFFF" strokeWidth="10" strokeDasharray="6 4" />
            <line x1="128" y1="160" x2="128" y2="238" stroke="#FFFFFF" strokeWidth="10" strokeDasharray="6 4" />
            <line x1="18" y1="128" x2="96" y2="128" stroke="#FFFFFF" strokeWidth="10" strokeDasharray="6 4" />
            <line x1="160" y1="128" x2="238" y2="128" stroke="#FFFFFF" strokeWidth="10" strokeDasharray="6 4" />
          </svg>

          <div className="flex flex-col">
            <span className="text-white text-2xl font-playfair italic font-medium tracking-tight leading-none">
              PROTEUS
            </span>
            <span className="text-[8px] font-mono tracking-[0.24em] text-white/40 uppercase mt-0.5">
              Structural Biology / AI
            </span>
          </div>
        </a>
      </div>

      {/* Desktop Center Pill Navigation */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5 items-center gap-1 shadow-lg">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item;
          return (
            <button
              key={item}
              onClick={() => handleSelectTab(item)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Desktop CTA / Action */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={onGetStarted}
          className="bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white active:scale-95"
        >
          Get Started
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        aria-expanded={mobileMenuOpen}
        className="md:hidden h-10 w-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sliding Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col gap-3 shadow-2xl z-[110] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-1 pb-2 border-b border-white/10">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40">
              Structural Navigation
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item;
              return (
                <button
                  key={item}
                  onClick={() => handleSelectTab(item)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-base font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-white text-gray-900 font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{item}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#e8702a]" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onGetStarted?.();
            }}
            className="mt-2 w-full bg-[#e8702a] text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-[#d2611f] transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <span>Explore Structure</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </nav>
  );
}
