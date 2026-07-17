import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color: 'green' | 'amber' | 'red' | 'blue';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color }) => {
  const colorMap = {
    green: '#10b981',
    amber: '#f59e0b',
    red: '#ef4444',
    blue: '#2563eb',
  };

  return (
    <div className="prog">
      <div className="prog-fill" style={{ width: `${percentage}%`, background: colorMap[color] }} />
    </div>
  );
};
