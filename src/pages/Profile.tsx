import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { formatPriceCents } from '../types/database';
import type { Order, Profile } from '../types/database';

const Icon = ({ name, filled = false, className = "", style = {} }: { name: string, filled?: boolean, className?: string, style?: React.CSSProperties }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1", ...style } : style}>
    {name}
  </span>
);

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-secondary-fixed/20 text-secondary  ',
    confirmed: 'bg-primary/20 text-primary  ',
    processing: 'bg-primary/20 text-primary  ',
    shipped: 'bg-secondary-fixed/20 text-secondary  ',
    delivered: 'bg-green-600/20 text-green-700  ',
    cancelled: 'bg-error/20 text-error',
    refunded: 'bg-error/20 text-error',
  };
  const labels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Ritual Complete',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return React.createElement('span', {
    className: `inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-tighter ${styles[status] ?? styles.pending}`,
    style: { clipPath: 'polygon(100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)' }
  }, labels[status] ?? status);
}

export default function Profile() {
  const { user, profile: authProfile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      async function load() {
        setLoading(true);
        try {
          const [profileData, ordersData] = await Promise.all([
            api.profile.get(user.id),
            api.orders.getByUser(user.id),
          ]);
          setProfile(profileData);
          setOrders(ordersData);
        } catch (e) {
          console.error('Failed to load profile', e);
        } finally {
          setLoading(false);
        }
      }
      load();
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const fullName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'Guest';
  const avatarUrl = profile?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2A5D5D&color=fcf9f0`;
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
  const roleLabel = profile?.role === 'super_admin' ? 'Super Curator' : profile?.role === 'admin' ? 'Elite Curator' : 'Curation Member';

  if (authLoading || loading) {
    return (
      <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
        <Header />
        <main className="relative z-10 pt-8 pb-32 max-w-7xl mx-auto px-6 flex-grow w-full">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-surface-container-low rounded-full" />
              <div className="space-y-3 flex-1">
                <div className="h-8 bg-surface-container-low rounded w-64" />
                <div className="h-4 bg-surface-container-low rounded w-48" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
        <Header />
        <main className="relative z-10 pt-8 pb-32 max-w-7xl mx-auto px-6 flex-grow w-full flex flex-col items-center justify-center">
          <Icon name="account_circle" className="text-8xl text-outline-variant mb-6" />
          <h1 className="font-noto-serif text-3xl font-bold text-primary mb-4">Welcome, Curator</h1>
          <p className="text-on-surface-variant mb-8 text-center max-w-md">Sign in to access your profile, order history, and exclusive member benefits.</p>
          <Link to="/login" className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-opacity">
            Sign In
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col relative">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}></div>
      
      <Header />

      <main className="relative z-10 pt-8 pb-32 max-w-7xl mx-auto px-6 flex-grow w-full">
        <header className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-highest shadow-xl">
              <img alt="User Profile" className="w-full h-full object-cover" src={avatarUrl} />
            </div>
            {profile?.is_verified && React.createElement('div', {
              className: 'absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg'
            }, 'Verified')}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-noto-serif font-bold text-primary mb-1">{fullName}</h1>
            <p className="text-on-surface-variant font-medium tracking-tight">
              {roleLabel}
              {memberSince && ` · Member since ${memberSince}`}
            </p>
            {profile?.phone && (
              <p className="text-sm text-on-surface-variant mt-1">{profile.phone}</p>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <section className="md:col-span-8 bg-surface-container-low rounded-xl p-8 relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-noto-serif text-primary mb-4">Membership Benefits</h2>
                <p className="text-on-surface-variant max-w-md mb-8">
                  You are a valued <span className="text-secondary font-bold">{roleLabel}</span>. Continue exploring our heritage collection.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link to="/" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-opacity">Browse Collection</Link>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Icon name="workspace_premium" className="text-[12rem] text-primary" style={{ fontVariationSettings: "'wght' 100" }} />
            </div>
          </section>

          <section className="md:col-span-4 bg-primary-container text-on-primary-container rounded-xl p-8 flex flex-col justify-between">
            <h3 className="text-xl font-noto-serif mb-6 text-on-primary-container/80">Account Insights</h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4">
                <Icon name="mail" className="text-secondary-fixed" />
                <div>
                  <p className="text-sm font-bold">Email</p>
                  <p className="text-xs opacity-70">{user.email}</p>
                </div>
              </li>
              {profile?.phone && React.createElement('li', { key: 'phone', className: 'flex items-center gap-4' },
                React.createElement(Icon, { name: "phone", className: "text-secondary-fixed" }),
                React.createElement('div', null,
                  React.createElement('p', { className: "text-sm font-bold" }, 'Phone'),
                  React.createElement('p', { className: "text-xs opacity-70" }, profile.phone)
                )
              )}
              <li className="flex items-center gap-4">
                <Icon name="shopping_bag" className="text-secondary-fixed" />
                <div>
                  <p className="text-sm font-bold">Total Orders</p>
                  <p className="text-xs opacity-70">{orders.length} ritual{orders.length !== 1 ? 's' : ''} placed</p>
                </div>
              </li>
            </ul>
            <button onClick={handleSignOut} className="mt-8 w-full border border-on-primary-container/20 py-3 rounded-lg text-sm font-bold hover:bg-on-primary-container/10 transition-colors flex items-center justify-center gap-2">
              <Icon name="logout" className="text-sm" />
              Sign Out
            </button>
          </section>

          <section className="md:col-span-12 lg:col-span-7 bg-surface-container rounded-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-noto-serif text-primary">Order Rituals</h2>
              <Link to="/track-order" className="text-sm font-bold text-secondary uppercase tracking-widest">Track Order</Link>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="shopping_bag" className="text-5xl text-outline-variant mb-4" />
                <p className="text-on-surface-variant">No orders yet. Start exploring our collection.</p>
                <Link to="/" className="inline-block mt-4 bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map(order => (
                  React.createElement('div', {
                    key: order.id,
                    className: 'bg-surface-container-lowest p-4 rounded-lg flex items-center gap-6 shadow-sm hover:bg-surface-container-low transition-colors'
                  },
                    React.createElement('div', { className: 'flex-grow' },
                      React.createElement('div', { className: 'flex justify-between items-start mb-1' },
                        React.createElement('h4', { className: 'font-bold text-primary' }, order.order_number ?? 'N/A'),
                        React.createElement('span', { className: 'text-sm font-bold text-on-surface' },
                          formatPriceCents(order.total_cents)
                        )
                      ),
                      React.createElement('p', { className: 'text-xs text-on-surface-variant mb-2' },
                        new Date(order.created_at ?? '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      ),
                      React.createElement(OrderStatusBadge, { status: order.status })
                    )
                  )
                ))}
                {orders.length > 5 && React.createElement('div', { className: 'text-center mt-4' },
                  React.createElement('p', { className: 'text-sm text-on-surface-variant' },
                    `+ ${orders.length - 5} more orders`
                  )
                )}
              </div>
            )}
          </section>

          <section className="md:col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-noto-serif text-primary">Account Settings</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-secondary">Profile</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Full Name</span>
                    <span className="font-medium">{profile?.full_name ?? 'Not set'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Email</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">Phone</span>
                      <span className="font-medium">{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/15">
                <button className="w-full text-left text-sm font-medium text-primary hover:underline">Change Password</button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-surface-container  w-full mt-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-12 border-t border-outline-variant/10 max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="font-noto-serif italic text-primary text-xl">The Heritage Curator</div>
            <p className="font-manrope text-sm tracking-tight text-on-surface/70  max-w-sm">
              Preserving the essence of Sri Lankan wellness through modern curation and ancient wisdom.
            </p>
            <p className="font-manrope text-xs text-on-surface/50 mt-4">© 2024 The Heritage Curator. Ceylon's Finest Apothecary.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3 font-manrope text-sm">
              <Link to="/support" className="text-on-surface/70  hover:text-primary underline decoration-[#2A5D5D]/30 transition-all duration-300">Provenance</Link>
              <Link to="/support" className="text-on-surface/70  hover:text-primary underline decoration-[#2A5D5D]/30 transition-all duration-300">Shipping</Link>
            </div>
            <div className="flex flex-col gap-3 font-manrope text-sm">
              <Link to="/support" className="text-on-surface/70  hover:text-primary underline decoration-[#2A5D5D]/30 transition-all duration-300">Ritual Guide</Link>
              <Link to="/support" className="text-on-surface/70  hover:text-primary underline decoration-[#2A5D5D]/30 transition-all duration-300">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface  flex justify-around items-center px-4 py-3 pb-safe z-50 border-t border-outline-variant/15 shadow-[0_-4px_20px_rgba(28,28,23,0.04)] rounded-t-lg">
        <Link to="/ritual-builder" className="flex flex-col items-center justify-center text-on-surface/50  hover:opacity-80 transition-transform duration-200 min-w-[64px] min-h-[44px] px-2 py-1 scale-95">
          <Icon name="history_edu" />
          <span className="font-manrope text-xs uppercase tracking-widest mt-1">Rituals</span>
        </Link>
        <Link to="/checkout" className="flex flex-col items-center justify-center text-on-surface/50  hover:opacity-80 transition-transform duration-200 min-w-[64px] min-h-[44px] px-2 py-1 scale-95">
          <Icon name="local_mall" />
          <span className="font-manrope text-xs uppercase tracking-widest mt-1">Bag</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center bg-primary text-primary rounded-xl transition-transform duration-200 min-w-[64px] min-h-[44px] px-4 py-1.5">
          <Icon name="account_circle" />
          <span className="font-manrope text-xs uppercase tracking-widest mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
