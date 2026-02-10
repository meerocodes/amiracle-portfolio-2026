
import React, { createContext, useContext, useState, useEffect } from 'react';

interface UIContextType {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  isTerminalOpen: boolean;
  setTerminalOpen: (isOpen: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTerminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    // Lock body scroll when any modal or terminal is open
    if (isModalOpen || isTerminalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen, isTerminalOpen]);

  return (
    <UIContext.Provider value={{ isModalOpen, setModalOpen, isTerminalOpen, setTerminalOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
