import { useState } from 'react';
import { X, CheckCircle, ArrowRight, User, Building2, Mail, Phone } from 'lucide-react';
import { saveLead } from '../../lib/supabase';

const SERVICES_LIST = [
  'Business Formation (LLC/Corp)', 'Compliance & Paperwork',
  'Trucking Setup (DOT/MC)', 'Funding & Business Credit',
  'Website / Digital System', 'Custom App / Portal', "Other / Not Sure Yet",
];
const TIMELINES = ['ASAP', 'Within 30 days', '1–3 months', 'Just exploring'];

interface ConsultationFormProps { onClose: () => void; }

export default function ConsultationForm({ onClose }: ConsultationFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', services: [] as string[], timeline: '', message: '' });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleService = (s: string) =>
    setForm(f => ({ ...f, services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s] }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveLead({ name: form.name, email: form.email, phone: form.phone, services: form.services, timeline: form.timeline, message: form.message, source: 'Consultation Form' });
    } catch { /* fail silently in demo */ }
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.18)] overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-cream border-b border-gray-100 px-7 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-display font-bold text-ink">Book Free Consultation</h2>
            <p className="text-xs text-muted mt-0.5">We respond within 24 hours</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink"><X className="w-5 h-5" /></button>
        </div>

        {!done ? (
          <form onSubmit={submit} className="px-7 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[['name', 'Full Name *', User], ['company', 'Business Name', Building2]].map(([field, ph, Icon]) => (
                <div key={field as string} className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input type="text" placeholder={ph as string} value={form[field as keyof typeof form] as string}
                    onChange={e => setForm(f => ({ ...f, [field as string]: e.target.value }))}
                    required={field === 'name'}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream" />
                </div>
              ))}
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream" />
            </div>

            <div>
              <p className="text-sm font-medium text-ink mb-2">Services you're interested in:</p>
              <div className="grid grid-cols-2 gap-2">
                {SERVICES_LIST.map(s => (
                  <button type="button" key={s} onClick={() => toggleService(s)}
                    className={`text-left text-xs p-3 rounded-xl border transition-all ${form.services.includes(s) ? 'bg-accent/8 border-accent/50 text-accent font-medium' : 'bg-cream border-gray-200 text-muted hover:border-gray-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-ink mb-2">Timeline:</p>
              <div className="flex flex-wrap gap-2">
                {TIMELINES.map(t => (
                  <button type="button" key={t} onClick={() => setForm(f => ({ ...f, timeline: t }))}
                    className={`text-xs px-4 py-2 rounded-full border transition-all ${form.timeline === t ? 'bg-accent text-white border-accent' : 'bg-cream border-gray-200 text-muted hover:border-gray-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <textarea placeholder="Tell us briefly about your business (optional)" value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 bg-cream resize-none" />

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm py-3 rounded-xl disabled:opacity-60">
              {loading ? 'Submitting…' : 'Submit My Request'} <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-muted">No obligation. We'll reach out within 24 hours.</p>
          </form>
        ) : (
          <div className="px-7 py-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-ink mb-2">You're All Set, {form.name}!</h3>
            <p className="text-muted text-sm mb-6">Our team will reach out to <span className="text-accent font-medium">{form.email}</span> within 24 hours.</p>
            <button onClick={onClose} className="btn-primary w-full justify-center">Back to Website</button>
          </div>
        )}
      </div>
    </div>
  );
}
