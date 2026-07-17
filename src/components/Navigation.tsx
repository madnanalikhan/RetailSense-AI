import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Clock } from './Clock';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, userName } = useAuth();

  const navItems = [
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/forecast', label: '📈 Forecast' },
    { path: '/inventory', label: '📦 Inventory' },
    { path: '/simulate', label: '🧪 Simulate' },
    { path: '/recommend', label: '🤖 AI Tips' },
  ];

  return (
    <nav>
      <div className="brand">
        <span className="brand-icon">🛒</span>
        RetailSense AI
        <span className="brand-tag">LIVE</span>
      </div>
      <div className="nav-menu">
        {navItems.map(item => (
          <button
            key={item.path}
            className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <Clock />
        <div className="user-chip">
          <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
          {userRole}
        </div>
      </div>
    </nav>
  );
};
