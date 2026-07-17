import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle: string;
  colorClass: 'c-red' | 'c-green' | 'c-blue' | 'c-amber';
  icon?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, subtitle, colorClass, icon }) => {
  return (
    <div className={`kpi ${colorClass}`}>
      {icon && <div className="kpi-ico">{icon}</div>}
      <div className="kpi-lbl">{label}</div>
      <div className="kpi-val">{value}</div>
      <div className="kpi-sub">{subtitle}</div>
    </div>
  );
};
