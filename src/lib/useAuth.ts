import { useState, useCallback } from 'react';
import type { AppUser } from '../types';
import { DEMO_USERS } from '../lib/constants';
import { signIn as sbSignIn, signOut as sbSignOut } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      // Demo mode: match hardcoded users first
      const demo = DEMO_USERS.find(u => u.email === email);
      const demoPasswords: Record<string, string> = {
        'client@demo.com': 'demo123',
        'admin@tps.com': 'admin123',
      };
      if (demo && demoPasswords[email] === password) {
        setUser(demo);
        return demo;
      }
      // Production: use Supabase
      const { user: sbUser } = await sbSignIn(email, password);
      if (sbUser) {
        const appUser: AppUser = {
          id: sbUser.id,
          name: sbUser.user_metadata?.name ?? email.split('@')[0],
          email: sbUser.email ?? email,
          company: sbUser.user_metadata?.company,
          role: sbUser.user_metadata?.role ?? 'client',
        };
        setUser(appUser);
        return appUser;
      }
      throw new Error('Invalid credentials');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed';
      setError(msg.includes('Invalid login') ? 'Invalid email or password.' : msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback((userData: Omit<AppUser, 'id'>) => {
    const newUser: AppUser = { ...userData, id: `u-${Date.now()}` };
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try { await sbSignOut(); } catch { /* ignore in demo */ }
    setUser(null);
  }, []);

  return { user, loading, error, login, register, logout };
}
