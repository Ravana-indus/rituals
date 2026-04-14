import React from 'react';

interface IconProps {
  name: string;
  filled?: boolean;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, filled = false, className = '' }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}
  >
    {name}
  </span>
);
