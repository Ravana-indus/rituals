import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useCart } from '../context/CartContext';
import { formatPriceCents } from '../types/database';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount, totalSavings } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinkClass = (path: string) => `font-manrope font-medium uppercase tracking-wider text-sm whitespace-nowrap transition-colors duration-300 pb-1 ${
    isActive(path) 
      ? 'text-primary  border-b-2 border-primary  font-noto-serif'
      : 'text-on-surface-variant  hover:text-secondary border-b-2 border-transparent'
  }`;

  return (
    <header className="bg-surface/80  backdrop-blur-md shadow-sm  sticky top-0 z-50 flex flex-col w-full px-6 py-4 space-y-4 transition-colors duration-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-noto-serif text-2xl font-bold italic text-primary ">Rituals.lk</Link>
          <div className="hidden lg:flex items-center bg-surface-container  rounded-full px-4 py-2 w-auto lg:w-96 flex-grow max-w-sm border border-secondary/20 ">
            <Icon name="search" className="text-outline " />
            <form onSubmit={handleSearch} className="w-full ml-2">
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full font-manrope text-on-surface  placeholder:text-outline dark:placeholder:text-outline-variant outline-none" placeholder="Search authentic brands..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </form>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-primary ">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs uppercase tracking-widest text-outline ">Balance</span>
            <span className="font-bold text-xs uppercase tracking-wider">{totalSavings > 0 ? `Total Savings: ${formatPriceCents(totalSavings)}` : 'Your Heritage Cart'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/login" className="hover:text-secondary transition-colors duration-300 scale-95 hidden sm:block">
              <Icon name="person" />
            </Link>
            <Link to="/cart" className="relative hover:text-secondary transition-colors duration-300 scale-95 hidden sm:block">
              <Icon name="shopping_bag" />
              <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{itemCount}</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Category Ribbon */}
      <nav className="flex items-center space-x-8 overflow-x-auto no-scrollbar pb-1 max-w-7xl mx-auto w-full">
        <Link to="/" className={navLinkClass('/')}>Apothecary</Link>
        <Link to="/ritual-builder" className={navLinkClass('/ritual-builder')}>Rituals</Link>
        <Link to="/consult" className={navLinkClass('/consult')}>Consult</Link>
        <Link to="/support" className={navLinkClass('/support')}>Support</Link>
      </nav>
    </header>
  );
}
