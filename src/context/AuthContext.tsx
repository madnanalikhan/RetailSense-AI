import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string;
  userName: string;
  login: (email: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('Inventory Manager');
  const [userName, setUserName] = useState('');

  const login = (email: string, role: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(email.split('@')[0]);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole('Inventory Manager');
    setUserName('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
