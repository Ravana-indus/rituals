import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  LogOut, 
  Mail, 
  Phone, 
  ChevronRight, 
  History, 
  ShieldCheck, 
  Star,
  Settings,
  Package,
} from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { formatPriceCents } from '../types/database';
import type { Order, Profile } from '../types/database';

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-[var(--dd-surface-strong)] text-black',
    confirmed: 'bg-[var(--dd-surface-base)] text-white',
    processing: 'bg-[var(--dd-surface-base)] text-white',
    shipped: 'bg-[#76885B]/10 text-[#76885B]',
    delivered: 'bg-green-600/10 text-green-600',
    cancelled: 'bg-red-600/10 text-red-600',
    refunded: 'bg-red-600/10 text-red-600',
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
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] ?? styles.pending}`}>
      {labels[status] ?? status}
    </span>
  );
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
    window.scrollTo(0, 0);
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const fullName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'Guest';
  const avatarUrl = profile?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=000000&color=ffffff&bold=true`;
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
  const roleLabel = profile?.role === 'super_admin' ? 'Super Curator' : profile?.role === 'admin' ? 'Elite Curator' : 'Curation Member';

  if (authLoading || loading) return (
    <BrandedLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--dd-surface-strong)] border-t-black" />
      </div>
    </BrandedLayout>
  );

  if (!user) return null;

  return (
    <BrandedLayout>
      <div className="px-[var(--dd-space-4)] py-[var(--dd-space-8)] md:px-[var(--dd-space-6)]">
        <header className="flex flex-col md:flex-row items-center gap-8 mb-16 max-w-4xl mx-auto text-center md:text-left">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img alt="User Profile" className="w-full h-full object-cover" src={avatarUrl} />
            </div>
            {profile?.is_verified && (
              <div className="absolute -bottom-2 right-0 bg-[#76885B] text-white p-2 rounded-full shadow-lg">
                <ShieldCheck className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-[40px] font-bold tracking-tight text-black">{fullName}</h1>
            <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
               <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#76885B]">{roleLabel}</span>
               <span className="h-1 w-1 rounded-full bg-[var(--dd-surface-base)] opacity-20" />
               <span className="text-[13px] font-medium opacity-40">Member since {memberSince}</span>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-6 py-3 rounded-[var(--dd-radius-sm)] border-2 border-[var(--dd-surface-strong)] font-bold text-[14px] hover:bg-[var(--dd-surface-strong)] transition active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 max-w-[1600px] mx-auto">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Membership Card */}
            <section className="relative overflow-hidden rounded-[var(--dd-radius-xs)] bg-[var(--dd-surface-base)] p-10 text-white shadow-xl">
               <div className="relative z-10">
                 <h2 className="text-[28px] font-bold tracking-tight mb-4">Membership Benefits</h2>
                 <p className="max-w-md text-[16px] leading-relaxed opacity-60">
                   You are an active participant in our collective. Your status grants you priority access to small-batch clearance releases.
                 </p>
                 <div className="mt-8 flex gap-4">
                    <Link to="/" className="rounded-[var(--dd-radius-sm)] bg-[#76885B] px-8 py-3 text-[14px] font-black uppercase tracking-widest text-black shadow-lg hover:opacity-90 transition">
                      Browse Collection
                    </Link>
                 </div>
               </div>
               <Star className="absolute bottom-[-40px] right-[-40px] h-64 w-64 opacity-10 rotate-12" />
            </section>

            {/* Order History */}
            <section className="rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] bg-white p-8">
               <div className="flex justify-between items-center mb-8 border-b border-[var(--dd-surface-strong)] pb-6">
                 <h2 className="text-[24px] font-bold tracking-tight">Order History</h2>
                 <History className="h-6 w-6 opacity-20" />
               </div>

               {orders.length === 0 ? (
                 <div className="py-16 text-center space-y-4">
                    <Package className="h-12 w-12 mx-auto opacity-10" />
                    <p className="text-[18px] font-bold opacity-40">No rituals placed yet.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="flex flex-wrap items-center justify-between gap-6 p-6 rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] hover:shadow-md transition">
                        <div className="flex items-center gap-6">
                          <div className="h-12 w-12 rounded-full bg-[var(--dd-surface-muted)] flex items-center justify-center border border-[var(--dd-surface-strong)]">
                             <ShoppingBag className="h-6 w-6 opacity-40" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-widest opacity-40">Order #{order.order_number?.slice(-8).toUpperCase()}</p>
                            <h4 className="text-[16px] font-bold mt-0.5">{new Date(order.created_at ?? '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                             <p className="text-[16px] font-bold">{formatPriceCents(order.total_cents)}</p>
                             <p className="text-[11px] opacity-40 uppercase font-black tracking-tighter mt-0.5">{order.payment_method}</p>
                          </div>
                          <OrderStatusBadge status={order.status} />
                          <ChevronRight className="h-5 w-5 opacity-20" />
                        </div>
                      </div>
                    ))}
                 </div>
               )}
            </section>
          </div>

          {/* Sidebar Info */}
          <aside className="lg:col-span-4 space-y-6">
            <section className="rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] bg-white p-8">
               <h3 className="text-[18px] font-bold tracking-tight mb-8 flex items-center gap-3">
                 <Settings className="h-5 w-5 opacity-40" />
                 Account Insights
               </h3>
               <ul className="space-y-6">
                 <InsightItem icon={Mail} label="Email Identity" value={user.email!} />
                 {profile?.phone && <InsightItem icon={Phone} label="Contact Tether" value={profile.phone} />}
                 <InsightItem icon={ShoppingBag} label="Total Rituals" value={`${orders.length} orders placed`} />
               </ul>
               <button className="mt-10 w-full rounded-[var(--dd-radius-sm)] border-2 border-[var(--dd-surface-base)] py-3 text-[13px] font-bold uppercase tracking-widest hover:bg-[var(--dd-surface-base)] hover:text-white transition">
                 Edit Profile Details
               </button>
            </section>

            <div className="rounded-[var(--dd-radius-xs)] bg-[#EB1700]/5 border border-[#EB1700]/10 p-6">
               <h4 className="text-[13px] font-black uppercase tracking-widest text-[#EB1700] mb-2">Security Advisory</h4>
               <p className="text-[13px] leading-relaxed opacity-70">
                 Always ensure your security token is unique. We will never ask for your ritual key via email.
               </p>
            </div>
          </aside>
        </div>
      </div>
    </BrandedLayout>
  );
}

function InsightItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <li className="flex items-start gap-4">
      <div className="mt-1 opacity-40"><Icon className="h-5 w-5" /></div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">{label}</p>
        <p className="text-[14px] font-bold mt-0.5 break-all">{value}</p>
      </div>
    </li>
  );
}

