import React from 'react';
import BrandedHeader from './BrandedHeader';
import BrandedFooter from './BrandedFooter';

const doorDashTokens = {
  '--dd-surface-base': '#50623A', // Muted Sage Green
  '--dd-surface-muted': '#ffffff',
  '--dd-surface-raised': '#ffffff',
  '--dd-surface-strong': '#f3f4f6',
  '--dd-text-primary': '#ffffff',
  '--dd-text-secondary': '#76885B', // Lighter Sage
  '--dd-text-tertiary': '#29351C', // Deep Green-Black
  '--dd-font-family': 'Times, serif',
  '--dd-radius-xs': '8px',
  '--dd-radius-sm': '1000px',
  '--dd-radius-md': '9999px',
  '--dd-space-1': '4px',
  '--dd-space-2': '8px',
  '--dd-space-3': '12px',
  '--dd-space-4': '16px',
  '--dd-space-5': '20px',
  '--dd-space-6': '46.5px',
  '--dd-space-7': '64px',
  '--dd-space-8': '220px',
  '--dd-shadow-1': 'rgba(25, 25, 25, 0) 0px 0px 0px 1px inset',
  '--dd-shadow-2': 'rgb(241, 241, 241) 0px 0px 0px 1px inset',
  '--dd-shadow-3': 'rgb(247, 247, 247) 0px 0px 0px 1px inset',
  '--dd-shadow-4': 'rgba(0, 0, 0, 0.2) 0px 2px 8px 0px',
} as React.CSSProperties;

export default function BrandedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={doorDashTokens} className="min-h-screen bg-[var(--dd-surface-muted)] font-[var(--dd-font-family)] text-[var(--dd-text-tertiary)]">
      <BrandedHeader />
      <main className="mx-auto max-w-[1600px]">
        {children}
      </main>
      <BrandedFooter />
    </div>
  );
}
