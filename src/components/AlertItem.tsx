import React from 'react';

interface AlertItemProps {
  type: 'danger' | 'warning' | 'info' | 'success';
  icon: string;
  message: string;
  subtitle: string;
}

export const AlertItem: React.FC<AlertItemProps> = ({ type, icon, message, subtitle }) => {
  return (
    <div className={`alert-item ${type}`}>
      <div className="alert-ico">{icon}</div>
      <div>
        <div className="alert-msg">{message}</div>
        <div className="alert-sub">{subtitle}</div>
      </div>
    </div>
  );
};
