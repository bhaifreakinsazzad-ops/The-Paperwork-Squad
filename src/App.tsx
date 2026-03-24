import { useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import type { AppUser } from './types';
import PublicPage from './pages/PublicPage';
import ClientPortal from './components/portal/ClientPortal';
import AdminDashboard from './components/admin/AdminDashboard';
import AuthModal from './components/modals/AuthModal';
import ConsultationForm from './components/modals/ConsultationForm';
import ValuationCalculator from './components/modals/ValuationCalculator';
import FundabilityChecker from './components/modals/FundabilityChecker';

type View = 'public' | 'portal' | 'admin';

export default function App() {
  const [view, setView] = useState<View>('public');
  const [user, setUser] = useState<AppUser | null>(null);

  // Modal state
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [consultOpen, setConsultOpen] = useState(false);
  const [valuationOpen, setValuationOpen] = useState(false);
  const [fundabilityOpen, setFundabilityOpen] = useState(false);

  const handleLogin = (loggedInUser: AppUser) => {
    setUser(loggedInUser);
    setAuthOpen(false);
    const isAdmin = loggedInUser.role === 'admin' || loggedInUser.role === 'super_admin';
    setView(isAdmin ? 'admin' : 'portal');
  };

  const handleLogout = () => {
    setUser(null);
    setView('public');
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      {/* ── Views ── */}
      {view === 'public' && (
        <PublicPage
          onOpenAuth={openAuth}
          onOpenConsult={() => setConsultOpen(true)}
          onOpenValuation={() => setValuationOpen(true)}
          onOpenFundability={() => setFundabilityOpen(true)}
        />
      )}

      {view === 'portal' && user && (
        <ClientPortal user={user} onLogout={handleLogout} />
      )}

      {view === 'admin' && user && (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}

      {/* ── Modals (always rendered on top) ── */}
      {authOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onLogin={handleLogin}
          onSwitchMode={setAuthMode}
        />
      )}

      {consultOpen && (
        <ConsultationForm onClose={() => setConsultOpen(false)} />
      )}

      {valuationOpen && (
        <ValuationCalculator onClose={() => setValuationOpen(false)} />
      )}

      {fundabilityOpen && (
        <FundabilityChecker onClose={() => setFundabilityOpen(false)} />
      )}
      
      <SpeedInsights />
    </>
  );
}
