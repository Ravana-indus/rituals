import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();
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
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate(redirectTo);
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative">
      <Header />
      <div className="fixed inset-0 opacity-30 z-0 pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBcK4A1ACJMcOXFNbRehPLMTlsUHhSqyS0uudYWgYv5LWF0-pIgTJ13nyoczgthjA3215mVxrD7JhoCZGTtkFPYntW-UXlN5ZkQAgCFxKwUbWZY8yc-PjLRKmcL2yDfEFcwoDOx279HnxihzjeOfqgKvr0qq_AvPNX_PX2EpIssFWCvp0exsB0eKHY9eCKrtgXs1ZIOPbQtfYgquvHq0crV2ErNuZfAqfalvWWPnTMUKN8pFoWp9g1QV9wMAHSASamKuuhHr0WsV2E_')" }}></div>

      <main className="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-surface via-surface/90 to-surface-container-low/50"></div>
          <img className="w-full h-full object-cover opacity-10 mix-blend-multiply" alt="Apothecary cabinet" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2-_EdQnRE7vmSNCBaWPsZdGKG5Fbqz9lng4USW_FE4OUaXvh-93NiS62Jz4mRTfQY0SaG-ss0-xA0D1iyazFXQim2s82E7Y4gEeggGiQIKwfeaaN8bCVaT1orvV_gHdTNZaWBoW-mY5rJPRkg6dzgOdYPcx98mNO7lb4HMMiPDtcJZ-rdPkMyGKxGhpAVccDgGVDyO9tS20QgkJJAoZWahePfm-adCDSJfV3TB_1-WKgEwZk4qpVKHieH2Tg8XRDHJ88Jr3f4lxYP" />
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/">
              <h1 className="text-3xl md:text-4xl font-noto-serif text-primary tracking-tight mb-2 hover:opacity-80 transition-opacity">Rituals.lk</h1>
            </Link>
            <p className="text-on-surface-variant font-manrope text-sm uppercase tracking-[0.2em] mb-8">Apothecary & Rituals</p>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-highest/40 border border-outline-variant/15">
              <Icon name="verified" className="text-[16px] text-primary" />
              <span className="text-xs uppercase tracking-widest font-semibold text-primary/80">Authenticity Guaranteed</span>
            </div>
          </div>

          <div className="bg-surface-container-low/80 backdrop-blur-xl p-8 md:p-10 rounded-xl shadow-[0_20px_40px_rgba(28,28,23,0.06)] border border-outline-variant/5">
            {error && (
              <div className="mb-4 p-3 bg-error-container rounded-lg text-sm text-on-error-container flex items-center gap-2">
                <Icon name="error" className="text-sm" />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-widest font-semibold text-on-surface-variant ml-1" htmlFor="email">Email Identity</label>
                <input
                  className="w-full bg-surface border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 transition-all duration-300"
                  id="email" name="email" placeholder="Enter your email address" type="email"
                  value={email} onChange={e => setEmail(e.target.value)} required
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-xs uppercase tracking-widest font-semibold text-on-surface-variant" htmlFor="password">Password Token</label>
                  <Link to="/support" className="text-xs text-secondary hover:text-primary transition-colors duration-300 font-medium tracking-tight">Forgot Password?</Link>
                </div>
                <input
                  className="w-full bg-surface border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 transition-all duration-300"
                  id="password" name="password" placeholder="••••••••" type="password"
                  value={password} onChange={e => setPassword(e.target.value)} required
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full block text-center bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-lg font-manrope font-semibold tracking-wide hover:opacity-95 transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
                >
                  {loading ? 'Entering...' : 'Enter the Sanctuary'}
                </button>
              </div>
            </form>
            <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
              <p className="text-on-surface-variant text-sm font-manrope">
                New seeker?
                <Link to="/register" className="text-primary font-bold hover:underline decoration-primary/30 underline-offset-4 ml-1">Begin your journey</Link>
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-center items-center gap-6 opacity-40">
            <div className="h-px w-8 bg-outline-variant"></div>
            <div className="font-noto-serif italic text-sm text-primary">Sri Lanka's Finest</div>
            <div className="h-px w-8 bg-outline-variant"></div>
          </div>
        </div>
      </main>

      <footer className="w-full mt-auto px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-outline-variant/10 bg-surface-container z-10">
        <div className="flex flex-col gap-2">
          <span className="font-noto-serif italic text-primary">Rituals.lk</span>
          <p className="font-manrope text-sm tracking-tight text-on-surface/70">© 2024 Rituals.lk. Sri Lanka's Finest Apothecary.</p>
        </div>
        <div className="flex flex-wrap md:justify-end gap-6 items-center">
          <Link to="/support" className="font-manrope text-sm tracking-tight text-on-surface/70 hover:text-primary underline decoration-primary/30 transition-all duration-300">Provenance</Link>
          <Link to="/support" className="font-manrope text-sm tracking-tight text-on-surface/70 hover:text-primary underline decoration-primary/30 transition-all duration-300">Shipping</Link>
          <Link to="/support" className="font-manrope text-sm tracking-tight text-on-surface/70 hover:text-primary underline decoration-primary/30 transition-all duration-300">Ritual Guide</Link>
          <Link to="/support" className="font-manrope text-sm tracking-tight text-on-surface/70 hover:text-primary underline decoration-primary/30 transition-all duration-300">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
