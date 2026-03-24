import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ChevronDown, ArrowRight, Check, LayoutDashboard, FileText, MessageSquare, Users, Zap, Calculator, CreditCard } from 'lucide-react';
import { FAQS } from '../../lib/constants';

gsap.registerPlugin(ScrollTrigger);

// ─── Testimonials ──────────────────────────────────────────
export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const bigQuote = card.querySelector('.big-quote') as HTMLElement;
    const tCards = Array.from(card.querySelectorAll('.t-card')) as HTMLElement[];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
      });
      tl.fromTo(card, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out' }, 0);
      tl.fromTo(bigQuote, { x: '-50vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0.08);
      tl.fromTo(tCards, { x: '50vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', stagger: 0.08 }, 0.12);
      tl.fromTo(bigQuote, { y: 0, opacity: 1 }, { y: '-12vh', opacity: 0, ease: 'power2.in' }, 0.7);
      tl.fromTo(tCards, { y: 0, opacity: 1 }, { y: '12vh', opacity: 0, ease: 'power2.in' }, 0.7);
      tl.fromTo(card, { opacity: 1 }, { opacity: 0.2, ease: 'power2.in' }, 0.75);
    }, section);
    return () => ctx.revert();
  }, []);

  const testimonials = [
    { quote: 'TPS got my MC number, DOT, and business credit profile in under two weeks.', name: 'Marcus D.', role: 'Iron Shield Trucking' },
    { quote: "From LLC formation to a website that actually converts — they handled everything.", name: 'Priya S.', role: 'Bloom Consulting LLC' },
    { quote: 'The client portal makes it easy to track every step. Zero chaos.', name: 'James W.', role: 'Apex Freight Solutions' },
  ];

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden z-[60]">
      <div ref={cardRef} className="section-card absolute left-[6vw] top-[10vh] w-[88vw] h-[80vh]">
        <div className="p-[6%] h-full flex gap-12">
          <div className="big-quote w-[42%] flex flex-col justify-center relative">
            <span className="absolute -top-6 -left-2 text-[180px] leading-none text-accent opacity-8 font-serif select-none">"</span>
            <span className="text-label block mb-3 relative z-10">Client Results</span>
            <h2 className="text-[clamp(30px,3.8vw,52px)] font-display font-bold text-ink mb-4 relative z-10">
              Real Businesses.<br /><span className="highlight-red">Real Results.</span>
            </h2>
            <p className="text-lg text-muted leading-relaxed relative z-10">
              Founders, owners, and operators use The Paperwork Squad to stay focused on what matters.
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="t-card bg-cream rounded-[20px] p-5 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-base text-ink font-medium mb-3">"{t.quote}"</p>
                <div>
                  <p className="font-display font-semibold text-ink text-sm">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────
interface FAQSectionProps { onOpenConsult: () => void; }

export function FAQSection({ onOpenConsult }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative w-full py-24 z-[70] bg-cream">
      <div className="section-card mx-[6vw] p-[5vh_5vw]">
        <div className="text-center mb-12">
          <span className="text-label block mb-2">Got Questions?</span>
          <h2 className="text-[clamp(30px,3.8vw,52px)] font-display font-bold text-ink">
            Questions, <span className="highlight-red">Answered</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3 max-w-5xl mx-auto mb-12">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-100 bg-white rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-cream transition-colors"
              >
                <span className="font-display font-medium text-ink text-sm">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted flex-shrink-0 ml-3 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-muted text-sm leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
        {/* Final CTA bar */}
        <div className="bg-accent rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-1">Ready to stop doing business the hard way?</h3>
            <p className="text-white/75 text-sm">Book your free consultation. We'll tell you exactly what your business needs.</p>
          </div>
          <button onClick={onOpenConsult} className="bg-white text-accent px-7 py-3 rounded-full font-display font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap flex items-center gap-2">
            Book Free Consultation <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Preview ─────────────────────────────────────
interface DashboardPreviewProps { onOpenAuth: (mode: 'login' | 'register') => void; }

export function DashboardPreviewSection({ onOpenAuth }: DashboardPreviewProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const textContent = card.querySelector('.text-content') as HTMLElement;
    const uiPreview = card.querySelector('.ui-preview') as HTMLElement;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
      });
      tl.fromTo(card, { y: '100vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 0);
      tl.fromTo(textContent, { x: '-40vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0.08);
      tl.fromTo(uiPreview, { x: '60vw', rotate: 1.5, opacity: 0 }, { x: 0, rotate: 0, opacity: 1, ease: 'power2.out' }, 0.12);
      tl.fromTo(uiPreview, { y: 0, scale: 1, opacity: 1 }, { y: '-18vh', scale: 0.96, opacity: 0, ease: 'power2.in' }, 0.7);
      tl.fromTo(textContent, { opacity: 1 }, { opacity: 0.2, ease: 'power2.in' }, 0.75);
      tl.fromTo(card, { opacity: 1 }, { opacity: 0.2, ease: 'power2.in' }, 0.75);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden z-[80]">
      <div ref={cardRef} className="section-card absolute left-[6vw] top-[10vh] w-[88vw] h-[80vh]">
        <div className="p-[6%] h-full flex gap-10">
          <div className="text-content w-[34%] flex flex-col justify-center">
            <span className="text-label block mb-3">Client Portal</span>
            <h2 className="text-[clamp(30px,3.6vw,50px)] font-display font-bold text-ink mb-4">
              Everything In <span className="highlight-red">One Place</span>
            </h2>
            <ul className="space-y-4 mb-8">
              {['Submit service requests instantly', 'Track case status in real time', 'Message your specialist directly', 'Upload documents securely', 'Pay invoices & view history'].map(item => (
                <li key={item} className="flex items-center gap-3 text-ink text-sm">
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => onOpenAuth('register')} className="btn-primary w-fit text-sm">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Simulated portal UI preview */}
          <div className="ui-preview flex-1 bg-[#06090F] rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-11 bg-[#0A0E1A] border-b border-white/10 flex items-center px-4 gap-3">
              <LayoutDashboard className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-white text-sm font-medium">Client Portal — The Paperwork Squad</span>
              <div className="ml-auto flex gap-1.5">
                {['#ff5f57','#febc2e','#28c840'].map(c => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="flex flex-1 min-h-0">
              <div className="w-14 bg-[#0A0E1A] border-r border-white/10 flex flex-col items-center py-4 gap-3">
                {[LayoutDashboard, FileText, MessageSquare, Users, Zap].map((Icon, i) => (
                  <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-[#C9A84C]/20' : 'bg-white/5'}`}>
                    <Icon className={`w-4 h-4 ${i === 0 ? 'text-[#C9A84C]' : 'text-gray-500'}`} />
                  </div>
                ))}
              </div>
              <div className="flex-1 p-4 bg-[#06090F] overflow-hidden">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">Active Cases</p>
                <div className="space-y-2 mb-4">
                  {[
                    { title: 'LLC Formation — Johnson Logistics', status: 'In Process', color: 'bg-blue-500/20 text-blue-400' },
                    { title: 'Website Build — Growth Builder', status: 'Waiting on Client', color: 'bg-amber-500/20 text-amber-400' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#0A0E1A] border border-white/8 rounded-xl p-3 flex items-center justify-between">
                      <p className="text-[12px] text-white font-medium">{item.title}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.color}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Pending Tasks</p>
                <div className="space-y-1.5">
                  {['Upload Government-Issued ID', 'Submit EIN Application'].map((t, i) => (
                    <div key={i} className="bg-[#0A0E1A] border border-amber-500/20 rounded-lg p-2.5 flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-amber-500/40 flex-shrink-0" />
                      <span className="text-[11px] text-gray-300">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Lead Gen Banner (Valuation + Fundability CTAs) ─────────
interface LeadGenBannerProps {
  onOpenValuation: () => void;
  onOpenFundability: () => void;
}

export function LeadGenBanner({ onOpenValuation, onOpenFundability }: LeadGenBannerProps) {
  return (
    <section className="relative z-[85] py-0">
      <div className="mx-[6vw] grid md:grid-cols-2 gap-4">
        <button
          onClick={onOpenValuation}
          className="group flex items-center gap-4 bg-white border-2 border-accent/20 hover:border-accent/60 rounded-2xl p-5 text-left transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
            <Calculator className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <div className="font-display font-semibold text-ink mb-0.5">Free Business Valuation</div>
            <div className="text-sm text-muted">Find out what your business is worth in 60 seconds</div>
          </div>
          <ArrowRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </button>

        <button
          onClick={onOpenFundability}
          className="group flex items-center gap-4 bg-white border-2 border-green-500/20 hover:border-green-500/60 rounded-2xl p-5 text-left transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="font-display font-semibold text-ink mb-0.5">Free Fundability Score</div>
            <div className="text-sm text-muted">Is your business ready for funding? Check in 2 mins</div>
          </div>
          <ArrowRight className="w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </button>
      </div>
    </section>
  );
}

// ─── Closing CTA ───────────────────────────────────────────
interface ClosingCTAProps { onOpenConsult: () => void; }

export function ClosingCTASection({ onOpenConsult }: ClosingCTAProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const headline = content.querySelector('.headline') as HTMLElement;
    const sub = content.querySelector('.sub') as HTMLElement;
    const cta = content.querySelector('.cta') as HTMLElement;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
      });
      tl.fromTo(section, { opacity: 0 }, { opacity: 1, ease: 'power2.out' }, 0);
      tl.fromTo(headline, { y: '40vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 0.08);
      tl.fromTo(sub, { y: '20vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 0.12);
      tl.fromTo(cta, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, ease: 'back.out' }, 0.16);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden z-[90] bg-navy">
      <div ref={contentRef} className="text-center relative px-6 max-w-2xl mx-auto">
        <h2 className="headline text-[clamp(44px,5.5vw,76px)] font-display font-bold text-accent mb-4">
          Let's get to work.
        </h2>
        <p className="sub text-xl text-white/75 mb-8 max-w-lg mx-auto leading-relaxed">
          Pick a package, create your portal, and start delegating your paperwork today.
        </p>
        <button onClick={onOpenConsult} className="cta btn-primary text-lg px-10 py-4">
          Book Free Consultation <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-white/40 text-sm mt-4">Satisfaction guaranteed. No setup fees.</p>
      </div>
    </section>
  );
}
