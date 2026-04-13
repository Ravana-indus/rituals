import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get redirect URL from query params, default to '/profile'
  const redirectTo = searchParams.get('redirect') || '/profile';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate(redirectTo);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed relative">
      <Header />
      <div className="absolute inset-0 pointer-events-none z-[99] opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      <main className="flex-grow flex flex-col md:flex-row min-h-screen">
        <section className="hidden md:flex md:w-5/12 lg:w-1/2 relative overflow-hidden bg-primary-container">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-60 mix-blend-multiply" alt="Atmospheric still life of antique amber apothecary bottles" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8ytkqSi0aEfGGnZTpBVCcgGrNuyqlL92OuODC_0BUWz2F4cibJ1fYt3sLY40cppS87UjB9F5ekpI7XkgehMi-vYm3dKRvzKjxHmQx6Jv9a5dO5bAg1wPIRShZLyRZrNpe9U2dUP8mkhiUfWEeFBGVmVfy-FHchPv7Q5CHSVgEElLHZpHULJcz74ieyrLIBWQG25CrFe-BILB48P2DBklC_nqiYAMWBsuZMwybkadsH-FFF3Y7zuTWyEVrcNcSYgpVqBKCoKHrcc1M" />
          </div>
          <div className="relative z-10 p-12 lg:p-24 flex flex-col justify-between h-full text-surface">
            <div className="space-y-4">
              <Link to="/" className="font-noto-serif text-4xl lg:text-5xl font-medium tracking-tight hover:opacity-80 transition-opacity">The Heritage Curator</Link>
              <div className="w-12 h-px bg-secondary-fixed"></div>
            </div>
            <div className="max-w-md space-y-8">
              <div>
                <h2 className="font-noto-serif text-2xl mb-4 italic">A Legacy of Restoration</h2>
                <p className="font-manrope font-light text-surface-variant leading-relaxed opacity-90">
                  Rooted in the ancient botanical wisdom of Ceylon, we curate rituals that transcend time. Every vessel tells a story of provenance, authenticity, and the pursuit of refined well-being.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 pt-8">
                <div className="flex items-start gap-4">
                  <Icon name="auto_awesome" className="text-secondary-fixed text-2xl" />
                  <div>
                    <p className="font-manrope font-bold text-sm tracking-widest uppercase mb-1">Early Access</p>
                    <p className="text-xs text-surface-variant opacity-80">Priority selection for our limited seasonal Clearance releases.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="history_edu" className="text-secondary-fixed text-2xl" />
                  <div>
                    <p className="font-manrope font-bold text-sm tracking-widest uppercase mb-1">Saved Rituals</p>
                    <p className="text-xs text-surface-variant opacity-80">Preserve your personal apothecary guides for consistent restorative practice.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="verified_user" className="text-secondary-fixed text-2xl" />
                  <div>
                    <p className="font-manrope font-bold text-sm tracking-widest uppercase mb-1">Authenticity Tracking</p>
                    <p className="text-xs text-surface-variant opacity-80">Verify the batch origin and botanical pedigree of every curator's choice.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs font-manrope tracking-widest opacity-60 uppercase">
              Ceylon's Finest Apothecary • Established 2024
            </div>
          </div>
        </section>

        <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-24 bg-surface relative z-10">
          <div className="md:hidden w-full max-w-md mb-12 text-center">
            <Link to="/" className="font-noto-serif text-3xl font-medium text-primary">The Heritage Curator</Link>
          </div>
          <div className="w-full max-w-md">
            <header className="mb-12">
              <h2 className="font-noto-serif text-3xl lg:text-4xl text-on-surface mb-3">Begin Your Ritual</h2>
              <p className="font-manrope text-on-surface-variant text-sm">Join our collective of discerning curators and access the inner sanctum of apothecarial craft.</p>
            </header>

            {error && (
              <div className="mb-4 p-3 bg-error-container rounded-lg text-sm text-on-error-container flex items-center gap-2">
                <Icon name="error" className="text-sm" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative group">
                <label className="block font-manrope text-[10px] font-bold tracking-widest uppercase text-outline mb-1 transition-colors group-focus-within:text-primary" htmlFor="full_name">Full Name</label>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary transition-all font-manrope text-on-surface placeholder:text-outline-variant/50"
                  id="full_name" name="full_name" placeholder="Ananda Perera" required type="text"
                  value={fullName} onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div className="relative group">
                <label className="block font-manrope text-[10px] font-bold tracking-widest uppercase text-outline mb-1 transition-colors group-focus-within:text-primary" htmlFor="email">Email Address</label>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary transition-all font-manrope text-on-surface placeholder:text-outline-variant/50"
                  id="email" name="email" placeholder="ritualist@heritagecurator.com" required type="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="relative group">
                <label className="block font-manrope text-[10px] font-bold tracking-widest uppercase text-outline mb-1 transition-colors group-focus-within:text-primary" htmlFor="password">Secret Key (Password)</label>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary transition-all font-manrope text-on-surface placeholder:text-outline-variant/50"
                  id="password" name="password" placeholder="••••••••••••" required type="password" minLength={8}
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-5">
                  <input className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface-container" id="inner_circle" name="inner_circle" type="checkbox" />
                </div>
                <div className="text-sm leading-6">
                  <label className="font-manrope text-sm text-on-surface-variant cursor-pointer" htmlFor="inner_circle">Join the Inner Circle</label>
                  <p className="text-xs text-outline italic">Receive our monthly journal on heritage restoration and early apothecary releases.</p>
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-br from-[#003a3a] to-[#1c5151] text-surface py-4 px-8 rounded-md font-manrope font-semibold text-sm tracking-widest uppercase shadow-[0_20px_40px_rgba(28,28,23,0.06)] hover:opacity-90 transition-all flex justify-between items-center group disabled:opacity-50"
                >
                  <span>{loading ? 'Creating...' : 'Begin Your Ritual'}</span>
                  <Icon name="arrow_forward" className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
            <footer className="mt-12 pt-8 border-t border-outline-variant/15 text-center">
              <p className="text-xs text-outline font-manrope uppercase tracking-wider">
                Already a curator?
                <Link to="/login" className="text-secondary font-bold hover:text-primary transition-colors underline decoration-secondary/30 ml-2">Enter the Vault</Link>
              </p>
            </footer>
          </div>
        </section>
      </main>

      <div className="fixed bottom-8 right-8 z-50 pointer-events-none md:pointer-events-auto">
        <div className="w-24 h-24 rounded-full bg-tertiary-container flex flex-col items-center justify-center text-on-tertiary shadow-xl transform rotate-12 shadow-[0_20px_40px_rgba(28,28,23,0.06)] border-4 border-dashed border-on-tertiary/20">
          <Icon name="local_post_office" filled className="text-3xl" />
          <span className="text-[8px] font-bold tracking-tighter uppercase text-center mt-1">Authentic<br/>Heritage</span>
        </div>
      </div>

      <footer className="bg-surface-container py-6 px-8 border-t border-outline-variant/10 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-manrope uppercase tracking-widest text-outline">
          <div>© 2024 The Heritage Curator. Ceylon's Finest Apothecary.</div>
          <div className="flex gap-6">
            <Link to="/support" className="hover:text-primary transition-colors">Provenance</Link>
            <Link to="/support" className="hover:text-primary transition-colors">Shipping</Link>
            <Link to="/support" className="hover:text-primary transition-colors">Ritual Guide</Link>
            <Link to="/support" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
