import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/profile';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
    } else {
      navigate(redirectTo);
    }
  }

  return (
    <BrandedLayout>
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-[var(--dd-space-4)] py-12 md:px-[var(--dd-space-6)]">
        <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--dd-surface-base)] text-white shadow-xl">
               <ShieldCheck className="h-8 w-8" />
             </div>
             <h1 className="mt-6 text-[32px] font-bold tracking-tight text-black">Welcome Back</h1>
             <p className="mt-2 text-[14px] font-medium opacity-40 uppercase tracking-widest">Sign in to your sanctuary</p>
          </div>

          <div className="rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] bg-white p-8 shadow-xl">
            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4 text-[13px] font-bold text-[#EB1700] border border-red-100 flex gap-3 items-center">
                <div className="h-2 w-2 rounded-full bg-[#EB1700] animate-pulse" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Security Key</label>
                  <button type="button" className="text-[11px] font-bold uppercase tracking-widest text-[var(--dd-text-secondary)] hover:underline">Forgot Token?</button>
                </div>
                <div className="relative flex items-center rounded-md border border-[var(--dd-surface-strong)] bg-[var(--dd-surface-muted)] focus-within:border-black transition">
                  <div className="pl-4 opacity-40"><Lock className="h-4 w-4" /></div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-transparent px-4 py-3 text-[14px] outline-none placeholder:opacity-30"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] py-4 text-[15px] font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:opacity-20"
              >
                {loading ? 'Authenticating...' : 'Enter the Sanctuary'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-[var(--dd-surface-strong)] text-center">
              <p className="text-[13px] font-medium opacity-60">
                New seeker?
                <Link to="/register" className="ml-2 font-bold text-black hover:underline underline-offset-4 flex items-center justify-center gap-2 mt-2">
                  <UserPlus className="h-4 w-4" />
                  Begin your journey
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center opacity-20">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">SRI LANKA'S FINEST APOTHECARY</span>
          </div>
        </div>
      </div>
    </BrandedLayout>
  );
}

