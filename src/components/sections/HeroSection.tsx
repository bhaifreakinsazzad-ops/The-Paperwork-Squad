import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';
import { STATS } from '../../lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onOpenConsult: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export default function HeroSection({ onOpenConsult, onOpenAuth }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const headline = headlineRef.current;
    const stamp = stampRef.current;
    if (!section || !card || !headline || !stamp) return;

    const ctx = gsap.context(() => {
      // Entrance
      gsap.fromTo(card, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
      gsap.fromTo(Array.from(headline.children), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', delay: 0.2 });
      gsap.fromTo(stamp, { opacity: 0, scale: 0.85, rotate: -6 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: 'back.out(1.6)', delay: 0.35 });

      // Scroll exit
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
      });
      tl.fromTo(headline, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7);
      tl.fromTo(stamp, { x: 0, scale: 1, opacity: 1 }, { x: '22vw', scale: 0.92, opacity: 0, ease: 'power2.in' }, 0.7);
      tl.fromTo(card, { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0.15, ease: 'power2.in' }, 0.75);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden z-10">
      <div ref={cardRef} className="section-card absolute left-[6vw] top-[10vh] w-[88vw] h-[80vh] flex items-center">
        <div className="w-full h-full relative">

          {/* Left: headline & CTAs */}
          <div ref={headlineRef} className="absolute left-[6%] top-[12%] max-w-[48%]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-label">Now Onboarding New Clients — Limited Spots</span>
            </div>

            <h1 className="text-[clamp(38px,4.8vw,70px)] font-display font-bold leading-[1.05] tracking-[-0.02em] text-ink mb-5">
              Stop Getting Lost<br />
              In The <span className="highlight-red">Paperwork.</span>
            </h1>

            <p className="text-lg text-muted leading-relaxed mb-8 max-w-[92%]">
              The Paperwork Squad handles your LLC formation, compliance, trucking setup, funding readiness, and digital presence — so you can focus on running your business.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button onClick={onOpenConsult} className="btn-primary">
                Start My Launch <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => onOpenAuth('login')} className="btn-secondary">
                Client Portal
              </button>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-5">
              {[{ icon: Star, label: '98% Satisfaction' }, { icon: Shield, label: 'Secure & Confidential' }, { icon: Clock, label: '48hr Avg. Turnaround' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs text-muted font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: decorative stamp + stats */}
          <div ref={stampRef} className="absolute right-[6%] top-1/2 -translate-y-1/2">
            {/* Main stamp */}
            <div className="stamp-circle w-[30vw] h-[30vw] max-w-[440px] max-h-[440px] bg-gradient-to-br from-accent/10 to-accent-blue/10 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="text-[clamp(48px,5vw,80px)] font-display font-black text-accent leading-none mb-2">2,400+</div>
                <div className="text-sm font-medium text-muted uppercase tracking-wider">Businesses Launched</div>
                {/* Stats grid inside stamp */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {STATS.slice(1).map(s => (
                    <div key={s.label} className="bg-white/80 rounded-2xl p-3">
                      <div className="text-xl font-display font-bold text-ink">{s.num}</div>
                      <div className="text-[10px] text-muted">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative accent circles */}
            <div className="absolute -left-10 top-[15%] w-16 h-16 bg-accent-blue rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -right-4 bottom-[20%] w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
