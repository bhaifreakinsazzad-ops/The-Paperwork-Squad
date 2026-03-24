import { useState } from 'react';
import { X, ArrowRight, Shield, XCircle, CheckCircle } from 'lucide-react';
import { saveLead } from '../../lib/supabase';

const QUESTIONS = [
  { id: 'entity', q: 'Do you have a registered business entity?', options: ['Yes — LLC', 'Yes — Corporation', 'Sole Proprietor only', 'Not yet formed'] },
  { id: 'ein', q: 'Do you have an EIN (Employer Identification Number)?', options: ['Yes', 'No', 'Not sure'] },
  { id: 'bank', q: 'Do you have a dedicated business bank account?', options: ['Yes, 6+ months old', 'Yes, less than 6 months', 'No, using personal account'] },
  { id: 'phone', q: 'Do you have a business phone number listed with 411?', options: ['Yes', 'No'] },
  { id: 'address', q: 'Is your business address a real commercial address (not a P.O. Box or home address)?', options: ['Yes — commercial address', 'Home address', 'P.O. Box only'] },
  { id: 'website', q: 'Does your business have a professional website?', options: ['Yes, live website', 'No', 'In progress'] },
  { id: 'email', q: 'Do you have a business email with your own domain?', options: ['Yes', 'No — using Gmail/Yahoo', 'Not sure'] },
  { id: 'duns', q: 'Do you have a Dun & Bradstreet (DUNS) number?', options: ['Yes', 'No', 'Not sure'] },
  { id: 'tradelines', q: 'Do you have business tradelines or vendor credit?', options: ['Yes, 3+', 'Yes, 1–2', 'No', 'Not sure'] },
  { id: 'revenue', q: 'What is your average monthly revenue?', options: ['$10K+', '$5K–$10K', '$1K–$5K', 'Under $1K or Pre-revenue'] },
];

const SCORES: Record<string, Record<string, number>> = {
  entity: { 'Yes — LLC': 10, 'Yes — Corporation': 10, 'Sole Proprietor only': 3, 'Not yet formed': 0 },
  ein: { 'Yes': 10, 'No': 0, 'Not sure': 2 },
  bank: { 'Yes, 6+ months old': 10, 'Yes, less than 6 months': 6, 'No, using personal account': 0 },
  phone: { 'Yes': 8, 'No': 0 },
  address: { 'Yes — commercial address': 8, 'Home address': 4, 'P.O. Box only': 2 },
  website: { 'Yes, live website': 7, 'No': 0, 'In progress': 3 },
  email: { 'Yes': 7, 'No — using Gmail/Yahoo': 0, 'Not sure': 1 },
  duns: { 'Yes': 10, 'No': 0, 'Not sure': 0 },
  tradelines: { 'Yes, 3+': 15, 'Yes, 1–2': 8, 'No': 0, 'Not sure': 0 },
  revenue: { '$10K+': 15, '$5K–$10K': 10, '$1K–$5K': 5, 'Under $1K or Pre-revenue': 2 },
};

const FIXES = [
  { key: 'entity', bad: ['Sole Proprietor only', 'Not yet formed'], fix: 'Form an LLC or Corporation', impact: '+10 pts' },
  { key: 'ein', bad: ['No', 'Not sure'], fix: 'Get your EIN from the IRS', impact: '+10 pts' },
  { key: 'bank', bad: ['No, using personal account', 'Yes, less than 6 months'], fix: 'Open a dedicated business bank account', impact: '+10 pts' },
  { key: 'duns', bad: ['No', 'Not sure'], fix: 'Register for a DUNS number', impact: '+10 pts' },
  { key: 'tradelines', bad: ['No', 'Not sure'], fix: 'Build vendor tradelines (Net-30 accounts)', impact: '+15 pts' },
  { key: 'phone', bad: ['No'], fix: 'Get a 411-listed business phone number', impact: '+8 pts' },
  { key: 'website', bad: ['No', 'In progress'], fix: 'Launch a professional business website', impact: '+7 pts' },
];

function getLevel(score: number) {
  if (score >= 80) return { label: 'Strong', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', desc: 'Your business is well-positioned for funding. You likely qualify for credit lines and business loans.' };
  if (score >= 55) return { label: 'Building', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'You have a foundation but key gaps limit your capital access. A few strategic fixes will open doors.' };
  if (score >= 30) return { label: 'Early Stage', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', desc: 'Your fundability needs significant work. Let\'s build the right structure before approaching lenders.' };
  return { label: 'Not Ready', color: 'text-accent', bg: 'bg-accent/5', border: 'border-accent/20', desc: 'Your business is not currently fundable — but that can change in 60–90 days with the right steps.' };
}

interface Props { onClose: () => void; }

export default function FundabilityChecker({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<'quiz' | 'capture' | 'result'>('quiz');
  const [lead, setLead] = useState({ name: '', email: '', phone: '' });
  const [score, setScore] = useState(0);

  const q = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;

  const handleSelect = (val: string) => {
    const updated = { ...answers, [q.id]: val };
    setAnswers(updated);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const total = Math.min(Object.entries(updated).reduce((s, [k, v]) => s + (SCORES[k]?.[v] ?? 0), 0), 100);
      setScore(total);
      setPhase('capture');
    }
  };

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.name || !lead.email) return;
    try {
      await saveLead({ name: lead.name, email: lead.email, phone: lead.phone, source: 'Fundability Checker', meta: { answers, score } });
    } catch { /* fail silently */ }
    setPhase('result');
  };

  const level = getLevel(score);
  const neededFixes = FIXES.filter(f => f.bad.includes(answers[f.key] ?? ''));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-white rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.18)] overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-cream border-b border-gray-100 px-7 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-display font-bold text-ink">Business Fundability Checker</h2>
            <p className="text-xs text-muted mt-0.5">Free — 10 questions, 2 minutes</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink"><X className="w-5 h-5" /></button>
        </div>

        {phase === 'quiz' && (
          <div className="px-7 py-6">
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>Question {step + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <h3 className="text-lg font-display font-semibold text-ink mb-5">{q.q}</h3>
            <div className="grid gap-2">
              {q.options.map(opt => (
                <button key={opt} onClick={() => handleSelect(opt)}
                  className="text-left p-4 bg-cream border border-gray-200 rounded-xl text-sm text-ink hover:border-green-500/50 hover:bg-green-50/50 transition-all flex items-center justify-between group">
                  <span>{opt}</span>
                  <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-4 text-xs text-muted hover:text-ink">← Back</button>}
          </div>
        )}

        {phase === 'capture' && (
          <div className="px-7 py-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-ink mb-2">Your Score Is Ready!</h3>
              <p className="text-muted text-sm">Enter your details to unlock your full fundability report.</p>
            </div>
            <form onSubmit={handleCapture} className="space-y-3">
              <input type="text" placeholder="Full Name *" value={lead.name} onChange={e => setLead(l => ({ ...l, name: e.target.value }))} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-green-500/50 bg-cream" />
              <input type="email" placeholder="Business Email *" value={lead.email} onChange={e => setLead(l => ({ ...l, email: e.target.value }))} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-green-500/50 bg-cream" />
              <input type="tel" placeholder="Phone (for free strategy call)" value={lead.phone} onChange={e => setLead(l => ({ ...l, phone: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-green-500/50 bg-cream" />
              <button type="submit" className="w-full bg-green-600 text-white font-display font-semibold py-3.5 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                Show My Fundability Score <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-xs text-muted">No spam. 100% confidential.</p>
            </form>
          </div>
        )}

        {phase === 'result' && (
          <div className="px-7 py-6 space-y-5">
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-ink mb-4">Fundability Report — {lead.name}</h3>
              <div className={`${level.bg} border-2 ${level.border} rounded-2xl p-6 mb-2`}>
                <div className={`text-6xl font-display font-black ${level.color} mb-1`}>{score}</div>
                <div className="text-sm text-muted mb-2">out of 100</div>
                <div className={`text-lg font-display font-bold ${level.color} mb-3`}>{level.label} Fundability</div>
                <div className="w-full bg-white/60 rounded-full h-3 mb-3 overflow-hidden">
                  <div className={`h-3 rounded-full transition-all ${level.color.replace('text-', 'bg-')}`} style={{ width: `${score}%` }} />
                </div>
                <p className="text-sm text-muted text-center leading-relaxed">{level.desc}</p>
              </div>
            </div>

            {neededFixes.length > 0 && (
              <div>
                <h4 className="text-sm font-display font-semibold text-ink uppercase tracking-wider mb-3">What's Holding You Back</h4>
                <div className="space-y-2">
                  {neededFixes.map(f => (
                    <div key={f.key} className="flex items-center justify-between bg-cream rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-ink">{f.fix}</span>
                      </div>
                      <span className="text-xs font-bold text-green-600 flex-shrink-0 ml-3">{f.impact}</span>
                    </div>
                  ))}
                  {neededFixes.length === 0 && (
                    <div className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-ink">Excellent! Your business foundation is strong.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-navy rounded-2xl p-5">
              <h4 className="font-display font-bold text-white mb-1">Want Us to Fix All of This?</h4>
              <p className="text-sm text-white/65 mb-4">We get businesses from unfundable to funding-ready in 60–90 days. Book a free strategy call to see your path forward.</p>
              <button onClick={onClose} className="w-full bg-accent text-white font-display font-semibold py-3 rounded-xl hover:bg-[#c43333] transition-colors">
                Book My Free Strategy Call
              </button>
            </div>
            <p className="text-center text-xs text-muted">Results sent to {lead.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
