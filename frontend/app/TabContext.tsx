'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type SectionTab = 
  | 'beginner'
  | 'executive'
  | 'workspace'
  | 'precision'
  | 'digitaltwin'
  | 'medchemist'
  | 'intelligence'
  | 'quantum'
  | 'generator'
  | 'proteins'
  | 'docking'
  | 'dynamics'
  | 'models'
  | 'datasets'
  | 'ranking'
  | 'chemspace'
  | 'admet'
  | 'explain'
  | 'report'
  | 'experiments'
  | 'settings';

export type UserMode = 'beginner' | 'expert';

interface TabContextType {
  activeTab: SectionTab;
  setActiveTab: (tab: SectionTab) => void;
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  selectedProtein: string;
  setSelectedProtein: (protein: string) => void;
  smilesInput: string;
  setSmilesInput: (smiles: string) => void;
  bookmarks: string[];
  toggleBookmark: (smiles: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  activeRunVersion: string;
  setActiveRunVersion: (ver: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<SectionTab>('executive');
  const [userMode, setUserMode] = useState<UserMode>('expert');
  const [selectedProtein, setSelectedProtein] = useState<string>('1M17');
  const [smilesInput, setSmilesInput] = useState<string>('CC1=C(C=C(C=C1)NC2=NC=CC(=N2)C3=CN=CC=C3)NC(=O)C4=CC=C(C=C4)CN5CCN(C)CC5');
  const [bookmarks, setBookmarks] = useState<string[]>(['CC(=O)NC1=CC=C(O)C=C1', 'CN1CCC2=C(C1)C=C(C=C2)OC']);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [activeRunVersion, setActiveRunVersion] = useState<string>('V10');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleBookmark = (smiles: string) => {
    setBookmarks(prev => 
      prev.includes(smiles) ? prev.filter(s => s !== smiles) : [...prev, smiles]
    );
  };

  return (
    <TabContext.Provider value={{ 
      activeTab, 
      setActiveTab, 
      userMode, 
      setUserMode, 
      selectedProtein, 
      setSelectedProtein, 
      smilesInput, 
      setSmilesInput,
      bookmarks,
      toggleBookmark,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isCopilotOpen,
      setIsCopilotOpen,
      activeRunVersion,
      setActiveRunVersion
    }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
}
