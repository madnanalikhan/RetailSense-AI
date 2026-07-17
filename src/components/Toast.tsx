import React from 'react';
import { useToast } from '@context/ToastContext';

export const Toast: React.FC = () => {
  const { message, isVisible } = useToast();

  return (
    <div className={`toast ${isVisible ? 'show' : ''}`} role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
};
