import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Menu,
  Beaker,
  Sparkles,
  User,
  HelpCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export function BrandedNavLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 text-[14px] font-bold text-[var(--dd-text-tertiary)] transition py-2 px-1 border-b-2 ${
        isActive 
          ? 'opacity-100 border-[var(--dd-surface-base)]' 
          : 'opacity-80 border-transparent hover:opacity-100 hover:border-[var(--dd-surface-base)]'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export default function BrandedHeader() {
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[var(--dd-surface-base)] py-2 text-center text-[13.33px] text-[var(--dd-text-primary)]">
        Get free delivery on your first order. <span className="underline cursor-pointer">Details</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--dd-surface-strong)] bg-[var(--dd-surface-muted)] px-[var(--dd-space-4)] py-[var(--dd-space-3)] shadow-[var(--dd-shadow-4)] md:px-[var(--dd-space-6)]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-[var(--dd-space-4)]">
          <div className="flex items-center gap-[var(--dd-space-6)]">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[var(--dd-surface-base)] flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-[20px] font-bold tracking-tight text-[var(--dd-text-tertiary)]">Rituals</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-[var(--dd-space-5)] lg:flex">
              <BrandedNavLink to="/" icon={Beaker} label="Apothecary" />
              <BrandedNavLink to="/ritual-builder" icon={Sparkles} label="Rituals" />
              <BrandedNavLink to="/consult" icon={User} label="Consult" />
              <BrandedNavLink to="/support" icon={HelpCircle} label="Support" />
            </nav>
          </div>

          <div className="hidden flex-1 max-w-xl md:block px-4">
            <form onSubmit={handleSearch} className="relative flex items-center rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-strong)] px-4 py-2 shadow-[var(--dd-shadow-2)]">
              <Search className="h-4 w-4 text-[var(--dd-text-tertiary)] opacity-60" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items, brands, or rituals" 
                className="ml-2 w-full bg-transparent text-[14px] outline-none"
              />
            </form>
          </div>

          <div className="flex items-center gap-[var(--dd-space-4)]">
            <Link to="/login" className="hidden sm:inline-flex rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] px-4 py-2 text-[14px] font-bold text-white shadow-[var(--dd-shadow-4)] transition hover:opacity-90 active:scale-95">
              Sign In
            </Link>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-[var(--dd-surface-strong)] transition">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--dd-surface-base)] text-[10px] text-white">{itemCount}</span>
            </Link>
            <button className="lg:hidden p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
