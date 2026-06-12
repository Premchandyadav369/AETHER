'use client';

import React, { createContext, useContext, useState } from 'react';

export type Tab = 
  | 'home' 
  | 'copilot' 
  | 'workspace' 
  | 'proteins' 
  | 'molecules' 
  | 'pipeline' 
  | 'knowledge' 
  | 'dashboard' 
  | 'developer'
  | 'engine'
  | 'digitaltwin'
  | 'explain'
  | 'druglab'
  | 'pathogens'
  | 'cancer'
  | 'features';

interface TabContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  selectedProtein: string;
  setSelectedProtein: (protein: string) => void;
  smilesInput: string;
  setSmilesInput: (smiles: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedProtein, setSelectedProtein] = useState<string>('egfr');
  const [smilesInput, setSmilesInput] = useState<string>('CC(=O)NC1=CC=C(C=C1)O'); // Acetaminophen default

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab, selectedProtein, setSelectedProtein, smilesInput, setSmilesInput }}>
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
