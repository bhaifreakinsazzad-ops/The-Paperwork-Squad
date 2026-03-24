import { useState } from 'react';
import { X, Mail, Lock, User, Building2, Shield } from 'lucide-react';
import type { AppUser } from '../../types';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onLogin: (user: AppUser) => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ mode, onClose, onLogin, onSwitchMode }: AuthModalProps) {
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo credentials
  const DEMO: Record<string, { password: string; user: AppUser }> = {
    'client@demo.com': { password: 'demo123', user: { id: 'u1', name: 'Alex Johnson', email: 'client@demo.com', company: 'Johnson Logistics LLC', role: 'client' } },
    'admin@tps.com': { password: 'admin123', user: { id: 'u2', name: 'TPS Admin', email: 'admin@tps.com', company: 'The Paperwork Squad', role: 'super_admin' } },
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    if (mode === 'login') {
      const match = DEMO[form.email];
      if (match && match.password === form.password) {
        onLogin(match.user);
      } else {
        setError('Invalid credentials. Try: client@demo.com / demo123');
      }
    } else {
      if (!form.name || !form.email || !form.password) {
        setError('Please fill all required fields.');
        setLoading(false);
        return;
      }
      onLogin({ id: `u-${Date.now()}`, name: form.name, email: form.email, company: form.company, role: 'client' });
    }
    setLoading(false);
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.18)] overflow-hidden">
        {/* Header */}
        <div className="bg-cream px-7 pt-7 pb-5 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-display font-bold text-ink">
                {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h2>
              <p className="text-sm text-muted mt-1">
                {mode === 'login' ? 'Access your client portal' : 'Start your business journey'}
              </p>
            </div>
            <button onClick={onClose} className="text-muted hover:text-ink transition-colors mt-0.5">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handle} className="px-7 py-6 space-y-4">
          {mode === 'register' && (
            <>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type="text" placeholder="Full Name *" value={form.name} onChange={set('name')}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream" />
              </div>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type="text" placeholder="Business Name" value={form.company} onChange={set('company')}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream" />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="email" placeholder="Email Address *" value={form.email} onChange={set('email')} required
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="password" placeholder="Password *" value={form.password} onChange={set('password')} required
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream" />
          </div>

          {error && <p className="text-sm text-accent bg-accent/8 rounded-xl p-3">{error}</p>}

          {mode === 'login' && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <p className="text-xs text-blue-600">Demo: client@demo.com / demo123 · Admin: admin@tps.com / admin123</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm py-3 rounded-xl disabled:opacity-60">
            {loading ? 'Signing in…' : mode === 'login' ? 'Sign In to Portal' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-muted">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
              className="text-accent hover:underline font-medium">
              {mode === 'login' ? 'Sign Up Free' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
