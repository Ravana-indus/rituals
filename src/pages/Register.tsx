import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight, LogIn, Sparkles, History, UserCheck } from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/profile';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signUpError } = await signUp(email, password, fullName);
    setLoading(false);
    if (signUpError) {
      setError(signUpError);
    } else {
      navigate(redirectTo);
    }
  }

  return (
    <BrandedLayout>
      <div className="flex min-h-[calc(100vh-140px)] flex-col md:flex-row">
        {/* Visual Panel */}
        <section className="relative hidden w-full overflow-hidden bg-[var(--dd-surface-base)] md:flex md:w-1/2">
          <div className="absolute inset-0 opacity-40">
            <img 
              className="h-full w-full object-cover" 
              alt="Apothecary" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8ytkqSi0aEfGGnZTpBVCcgGrNuyqlL92OuODC_0BUWz2F4cibJ1fYt3sLY40cppS87UjB9F5ekpI7XkgehMi-vYm3dKRvzKjxHmQx6Jv9a5dO5bAg1wPIRShZLyRZrNpe9U2dUP8mkhiUfWEeFBGVmVfy-FHchPv7Q5CHSVgEElLHZpHULJcz74ieyrLIBWQG25CrFe-BILB48P2DBklC_nqiYAMWBsuZMwybkadsH-FFF3Y7zuTWyEVrcNcSYgpVqBKCoKHrcc1M" 
            />
          </div>
          <div className="relative z-10 flex flex-col justify-between p-16 text-white lg:p-24">
            <div className="space-y-4">
              <h2 className="text-[40px] font-bold leading-tight tracking-tight lg:text-[56px]">A Legacy of Restoration</h2>
              <div className="h-1 w-12 bg-[#76885B]" />
            </div>
            
            <div className="max-w-md space-y-8">
              <BenefitItem icon={Sparkles} title="Early Access" desc="Priority selection for our limited seasonal Clearance releases." />
              <BenefitItem icon={History} title="Saved Rituals" desc="Preserve your personal apothecary guides for consistent practice." />
              <BenefitItem icon={UserCheck} title="Authenticity Tracking" desc="Verify the batch origin and pedigree of every choice." />
            </div>
            
            <p className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-40">
              ESTABLISHED 2024 • SRI LANKA'S FINEST
            </p>
          </div>
        </section>

        {/* Form Panel */}
        <section className="flex flex-1 items-center justify-center bg-white px-[var(--dd-space-4)] py-12 md:px-[var(--dd-space-6)]">
          <div className="w-full max-w-[440px] space-y-8">
            <div className="text-center md:text-left">
               <h1 className="text-[32px] font-bold tracking-tight text-black">Begin Your Ritual</h1>
               <p className="mt-2 text-[14px] font-medium opacity-40 uppercase tracking-widest leading-relaxed">
                 Join our collective of curators
               </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-[13px] font-bold text-[#EB1700] border border-red-100 flex gap-3 items-center">
                <div className="h-2 w-2 rounded-full bg-[#EB1700] animate-pulse" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Full Name</label>
                <div className="relative flex items-center rounded-md border border-[var(--dd-surface-strong)] bg-[var(--dd-surface-muted)] focus-within:border-black transition">
                  <div className="pl-4 opacity-40"><User className="h-4 w-4" /></div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-transparent px-4 py-3 text-[14px] outline-none placeholder:opacity-30"
                    placeholder="Ananda Perera"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Email Identity</label>
                <div className="relative flex items-center rounded-md border border-[var(--dd-surface-strong)] bg-[var(--dd-surface-muted)] focus-within:border-black transition">
                  <div className="pl-4 opacity-40"><Mail className="h-4 w-4" /></div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-transparent px-4 py-3 text-[14px] outline-none placeholder:opacity-30"
                    placeholder="ritualist@heritagecurator.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Security Key</label>
                <div className="relative flex items-center rounded-md border border-[var(--dd-surface-strong)] bg-[var(--dd-surface-muted)] focus-within:border-black transition">
                  <div className="pl-4 opacity-40"><Lock className="h-4 w-4" /></div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-transparent px-4 py-3 text-[14px] outline-none placeholder:opacity-30"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] py-4 text-[15px] font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:opacity-20"
              >
                {loading ? 'Processing...' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-[var(--dd-surface-strong)] text-center">
              <p className="text-[13px] font-medium opacity-60">
                Already a curator?
                <Link to="/login" className="ml-2 font-bold text-black hover:underline underline-offset-4 flex items-center justify-center gap-2 mt-2">
                  <LogIn className="h-4 w-4" />
                  Enter the Vault
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </BrandedLayout>
  );
}

function BenefitItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 rounded-full bg-white/10 p-2">
        <Icon className="h-5 w-5 text-[#76885B]" />
      </div>
      <div>
        <h4 className="text-[14px] font-bold uppercase tracking-widest">{title}</h4>
        <p className="mt-1 text-[13px] opacity-60 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}

