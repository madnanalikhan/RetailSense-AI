import React, { createContext, useContext, useState } from 'react';

interface ToastContextType {
  message: string;
  isVisible: boolean;
  show: (msg: string) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const show = (msg: string) => {
    setMessage(msg);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 2800);
  };

  const hide = () => {
    setIsVisible(false);
  };

  return (
    <ToastContext.Provider value={{ message, isVisible, show, hide }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
