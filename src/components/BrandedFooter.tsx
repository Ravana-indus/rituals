import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function BrandedFooter() {
  return (
    <footer className="mt-[var(--dd-space-8)] border-t border-[var(--dd-surface-strong)] bg-[var(--dd-surface-base)] py-[var(--dd-space-7)] text-white">
      <div className="mx-auto max-w-[1600px] px-[var(--dd-space-4)] md:px-[var(--dd-space-6)]">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-bold text-[18px]">Get to Know Us</h3>
            <ul className="space-y-2 text-[14px] opacity-70">
              <li>About Rituals</li>
              <li>Sustainability</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-[18px]">Support</h3>
            <ul className="space-y-2 text-[14px] opacity-70">
              <li>Help Center</li>
              <li>Track Order</li>
              <li>Returns</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-[18px]">Account</h3>
            <ul className="space-y-2 text-[14px] opacity-70">
              <li>My Rituals</li>
              <li>Settings</li>
              <li>Concierge</li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-black" />
            </div>
            <p className="text-[14px] opacity-50">&copy; 2026 Rituals.lk. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
