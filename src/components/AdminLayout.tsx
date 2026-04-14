import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OrderProvider } from '../context/OrderContext';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { path: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { path: '/admin/brands', label: 'Brands', icon: 'stars' },
  { path: '/admin/categories', label: 'Categories', icon: 'category' },
  { path: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
  { path: '/admin/fulfillment', label: 'Fulfillment', icon: 'local_shipping' },
  { path: '/admin/users', label: 'Users', icon: 'people' },
  { path: '/admin/settings', label: 'Settings', icon: 'settings' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-on-surface-variant font-manrope">Loading admin console...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <OrderProvider>
    <div className="min-h-screen bg-surface flex">
      <aside className={`w-64 bg-primary text-on-primary flex flex-col fixed h-full z-50 transform transition-transform duration-200 ease-in-out print:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="font-noto-serif text-xl font-bold hover:opacity-80 transition-opacity">The Heritage Curator</Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 rounded hover:bg-surface text-on-primary">
            <Icon name="close" className="text-lg" />
          </button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive ? 'bg-surface font-semibold' : 'hover:bg-surface'
                }`}
              >
                <Icon name={item.icon} className="text-lg" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface rounded-lg transition-colors">
            <Icon name="storefront" className="text-lg" />
            View Store
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface rounded-lg transition-colors text-left">
            <Icon name="logout" className="text-lg" />
            Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <main className="flex-1 lg:ml-64">
        <div className="lg:hidden flex items-center gap-3 p-4 bg-surface border-b border-outline-variant/10 print:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors"
          >
            <Icon name="menu" className="text-xl" />
          </button>
          <Link to="/" className="font-noto-serif text-lg font-bold text-primary">The Heritage Curator</Link>
          <span className="text-xs uppercase tracking-widest text-on-surface-variant ml-2">Admin</span>
        </div>
        <Outlet />
      </main>
    </div>
    </OrderProvider>
  );
}
