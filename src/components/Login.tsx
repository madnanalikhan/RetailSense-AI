import React, { useState } from 'react';

import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@context/ToastContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Inventory Manager');
  const [showError, setShowError] = useState(false);
  const { login } = useAuth();
  const { show: showToast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = () => {
    if (!validateEmail(email) || password.length < 4) {
      setShowError(true);
      return;
    }

    setShowError(false);
    login(email, selectedRole);
    showToast(`Welcome back, ${email.split('@')[0]}! 👋`);
    navigate('/dashboard');
  };

  const roles = [
    { label: '📦 Inventory Manager', value: 'Inventory Manager' },
    { label: '🔗 Supply Chain Director', value: 'Supply Chain Director' },
    { label: '🏪 Store Manager', value: 'Store Manager' },
  ];

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">
          <span>🛒</span>
          <h1>RetailSense AI</h1>
        </div>
        <p className="login-sub">Demand Forecasting & Inventory Intelligence Platform</p>
        <p style={{ fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
          Sign in as:
        </p>
        <div className="role-pills" role="group" aria-label="Select your role">
          {roles.map(role => (
            <button
              key={role.value}
              type="button"
              className={`role-pill ${selectedRole === role.value ? 'sel' : ''}`}
              onClick={() => setSelectedRole(role.value)}
              aria-pressed={selectedRole === role.value}
            >
              {role.label}
            </button>
          ))}
        </div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="manager@retailsense.ai"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          aria-invalid={showError}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          autoComplete="current-password"
          aria-invalid={showError}
        />
        <div className={`login-err ${showError ? 'show' : ''}`} role="alert" aria-live="polite">
          ⚠ Please enter a valid email and password (min 4 characters).
        </div>
        <button className="login-btn" onClick={handleLogin}>
          Sign In →
        </button>
        <p className="login-hint">Demo: any valid email + 4+ character password</p>
      </div>
    </div>
  );
};
