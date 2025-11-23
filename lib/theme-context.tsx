"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isTransitioning: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    
    // Add smooth transition class
    root.classList.add('theme-transition');
    
    // Remove old theme classes
    root.classList.remove('light', 'dark');
    // Add new theme class
    root.classList.add(theme);
    
    localStorage.setItem('theme', theme);
    
    // Remove transition class after animation completes
    const timeout = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [theme, mounted]);

  const toggleTheme = () => {
    if (isTransitioning) return; // Prevent multiple toggles during transition
    
    setIsTransitioning(true);
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    
    // Allow enough time for the icon animation to complete
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}