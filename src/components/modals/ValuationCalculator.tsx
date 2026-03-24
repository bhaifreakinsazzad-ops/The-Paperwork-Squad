import { useState } from 'react';
import { X, ArrowRight, TrendingUp, Phone, CheckCircle } from 'lucide-react';
import { fmt } from '../../lib/utils';
import { saveLead } from '../../lib/supabase';
import type { ValuationAnswers, ValuationResult } from '../../types';

const QUESTIONS = [
  { id: 'industry', label: 'What industry is your business in?', options: ['Trucking / Freight', 'Consulting / Coaching', 'Ecommerce / Retail', 'Service Business', 'Real Estate', 'Healthcare', 'Technology / SaaS', 'Trades / Construction', 'Non-Profit', 'Other'] },
  { id: 'annual_revenue', label: 'What is your annual revenue?', options: ['Under $50K', '$50K – $150K', '$150K – $500K', '$500K – $1M', '$1M – $5M', 'Over $5M', 'Pre-Revenue / Startup'] },
  { id: 'years', label: 'How many years has your business been operating?', options: ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years'] },
  { id: 'employees', label: 'How many team members do you have?', options: ['Just me (solo)', '2–5', '6–15', '16–50', '50+'] },
  { id: 'entity', label: 'What is your business entity type?', options: ['Sole Proprietorship', 'LLC', 'S-Corp', 'C-Corp', 'Partnership', 'Not Yet Formed'] },
  { id: 'profitability', label: 'Is your business profitable?', options: ['Losing money', 'Breaking even', 'Slightly profitable (1–10%)', 'Profitable (10–25%)', 'Highly profitable (25%+)'] },
  { id: 'goal', label: 'What is your primary goal right now?', options: ['Grow the business', 'Attract investors', 'Sell the business', 'Access funding', 'Improve operations', 'Just curious'] },
];

const MULTIPLIERS: Record<string, Record<string, number>> = {
  industry: { 'Trucking / Freight': 1.4, 'Technology / SaaS': 3.5, 'Consulting / Coaching': 1.2, 'Ecommerce / Retail': 1.8, 'Service Business': 1.3, 'Real Estate': 2.0, 'Healthcare': 2.2, 'Trades / Construction': 1.3, 'Non-Profit': 0.8, 'Other': 1.2 },
  revenue: { 'Under $50K': 25000, '$50K – $150K': 100000, '$150K – $500K': 325000, '$500K – $1M': 750000, '$1M – $5M': 3000000, 'Over $5M': 7500000, 'Pre-Revenue / Startup': 15000 },
  years: { 'Less than 1 year': 0.5, '1–2 years': 0.8, '3–5 years': 1.1, '6–10 years': 1.3, '10+ years': 1.5 },
  employees: { 'Just me (solo)': 0.7, '2–5': 0.9, '6–15': 1.1, '16–50': 1.25, '50+': 1.4 },
  entity: { 'Sole Proprietorship': 0.7, 'LLC': 1.0, 'S-Corp': 1.1, 'C-Corp': 1.2, 'Partnership': 0.9, 'Not Yet Formed': 0.5 },
  profitability: { 'Losing money': 0.4, 'Breaking even': 0.7, 'Slightly profitable (1–10%)': 0.9, 'Profitable (10–25%)': 1.2, 'Highly profitable (25%+)': 1.5 },
  industry_multiple: { 'Trucking / Freight': 3.2, 'Technology / SaaS': 8.5, 'Consulting / Coaching': 2.5, 'Ecommerce / Retail': 4.0, 'Service Business': 3.0, 'Real Estate': 5.0, 'Healthcare': 5.5, 'Trades / Construction': 3.0, 'Non-Profit': 1.5, 'Other': 3.0 },
};

function calcValuation(a: ValuationAnswers): ValuationResult {
  const base = (MULTIPLIERS.revenue[a.annual_revenue ?? ''] ?? 100000) * (MULTIPLIERS.industry_multiple[a.industry ?? ''] ?? 3.0) * (MULTIPLIERS.industry[a.industry ?? ''] ?? 1.2) * (MULTIPLIERS.years[a.years ?? ''] ?? 1.0) * (MULTIPLIERS.employees[a.employees ?? ''] ?? 1.0) * (MULTIPLIERS.entity[a.entity ?? ''] ?? 1.0) * (MULTIPLIERS.profitability[a.profitability ?? ''] ?? 1.0);
  const low = Math.round(base * 0.75 / 1000) * 1000;
  const high = Math.round(base * 1.35 / 1000) * 1000;
  const mid = Math.round((low + high) / 2 / 1000) * 1000;
  return { low, mid, high };
}

interface Props { onClose: () => void; }

export default function ValuationCalculator({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ValuationAnswers>({});
  const [phase, setPhase] = useState<'quiz' | 'capture' | 'result'>('quiz');
  const [lead, setLead] = useState({ name: '', email: '', phone: '' });
  const [valuation, setValuation] = useState<ValuationResult | null>(null);

  const q = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;

  const handleSelect = (val: string) => {
    const updated = { ...answers, [q.id]: val };
    setAnswers(updated);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setValuation(calcValuation(updated));
      setPhase('capture');
    }
  };

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.name || !lead.email) return;
    try {
      await saveLead({ name: lead.name, email: lead.email, phone: lead.phone, source: 'Valuation Calculator', meta: { answers, valuation } });
    } catch { /* fail silently */ }
    setPhase('result');
  };

  const IMPROVEMENTS = [
    'Form proper LLC or Corporation → +10–25% value',
    'Build business credit profile → +15–30% fundability',
    'Document SOPs and processes → +10–20% value',
    'Add digital sales system → +20–40% growth',
    'Formalize compliance & contracts → +5–15% risk reduction',
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-white rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.18)] overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-cream border-b border-gray-100 px-7 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-display font-bold text-ink">Business Valuation Calculator</h2>
            <p className="text-xs text-muted mt-0.5">Free — takes 60 seconds</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink"><X className="w-5 h-5" /></button>
        </div>

        {/* Quiz */}
        {phase === 'quiz' && (
          <div className="px-7 py-6">
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>Question {step + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <h3 className="text-lg font-display font-semibold text-ink mb-5">{q.label}</h3>
            <div className="grid gap-2">
              {q.options.map(opt => (
                <button key={opt} onClick={() => handleSelect(opt)}
                  className="text-left p-4 bg-cream border border-gray-200 rounded-xl text-sm text-ink hover:border-accent/50 hover:bg-accent/5 transition-all flex items-center justify-between group">
                  <span>{opt}</span>
                  <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="mt-4 text-xs text-muted hover:text-ink transition-colors">← Back</button>
            )}
          </div>
        )}

        {/* Lead capture */}
        {phase === 'capture' && (
          <div className="px-7 py-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-display font-bold text-ink mb-2">Your Valuation Is Ready!</h3>
              <p className="text-muted text-sm">Enter your details to unlock your full valuation report — 100% free.</p>
            </div>
            <form onSubmit={handleCapture} className="space-y-3">
              <input type="text" placeholder="Your Full Name *" value={lead.name} onChange={e => setLead(l => ({ ...l, name: e.target.value }))} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream" />
              <input type="email" placeholder="Business Email *" value={lead.email} onChange={e => setLead(l => ({ ...l, email: e.target.value }))} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream" />
              <input type="tel" placeholder="Phone (for free consultation)" value={lead.phone} onChange={e => setLead(l => ({ ...l, phone: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream" />
              <button type="submit" className="btn-primary w-full justify-center py-3.5 rounded-xl">
                Show My Valuation <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-xs text-muted">No spam. No obligation. 100% confidential.</p>
            </form>
          </div>
        )}

        {/* Result */}
        {phase === 'result' && valuation && (
          <div className="px-7 py-6 space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-2 mb-4">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Valuation Complete — {lead.name}</span>
              </div>
              <div className="bg-accent/5 border-2 border-accent/20 rounded-2xl p-6 mb-4">
                <div className="text-5xl font-display font-black text-accent mb-1">{fmt(valuation.mid)}</div>
                <div className="text-sm text-muted mb-4">Estimated Market Value</div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-lg font-display font-bold text-ink">{fmt(valuation.low)}</div>
                    <div className="text-xs text-muted">Conservative</div>
                  </div>
                  <div className="flex-1 h-px mx-4 bg-gray-200" />
                  <div className="text-center">
                    <div className="text-lg font-display font-bold text-ink">{fmt(valuation.high)}</div>
                    <div className="text-xs text-muted">Optimistic</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-display font-semibold text-ink uppercase tracking-wider mb-3">How to Increase Your Value</h4>
              <div className="space-y-2">
                {IMPROVEMENTS.map(imp => (
                  <div key={imp} className="flex items-start gap-3 bg-cream rounded-xl px-4 py-3">
                    <TrendingUp className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-ink">{imp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-navy rounded-2xl p-5">
              <h4 className="font-display font-bold text-white mb-1">Want to Maximize This Number?</h4>
              <p className="text-sm text-white/65 mb-4">Our team helps businesses build proper structure, credit, compliance, and digital presence — all factors that directly increase value and fundability.</p>
              <button onClick={onClose} className="w-full bg-accent text-white font-display font-semibold py-3 rounded-xl hover:bg-[#c43333] transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> Book a Free Strategy Call
              </button>
            </div>

            <p className="text-center text-xs text-muted">Results sent to {lead.email}. This is an estimate based on industry data. Not financial advice.</p>
          </div>
        )}
      </div>
    </div>
  );
}
