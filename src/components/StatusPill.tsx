import React from 'react';

interface StatusPillProps {
  status: 'red' | 'green' | 'amber' | 'blue';
  label: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, label }) => {
  return <span className={`pill ${status}`}>{label}</span>;
};
